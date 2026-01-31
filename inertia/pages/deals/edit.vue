<script setup lang="ts">
import { ref, watch } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import DealDto from '#dtos/deal'
import ProductDto from '#dtos/product'

// Define interfaces for our form data
interface Product extends Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'> {
  id: number
  name: string
  description?: string
}

const props = defineProps<{ deal: DealDto; csrfToken: string }>()

const form = useForm({
  _method: props.deal.id ? 'put' : 'post',
  title: props.deal.title || '',
  description: props.deal.description || '',
  price: Number(props.deal.price) || 0,
  currency: props.deal.currency || 'EUR',
  location: props.deal.location || '',
  invoiceAvailable: props.deal.invoiceAvailable || false,
  sellingReason: props.deal.sellingReason || '',
  canBeDelivered: props.deal.canBeDelivered || false,
  features: props.deal.features?.length ? props.deal.features : [{ label: '', value: '' }],
  condition: props.deal.condition || 'GOOD',
  products:
    props.deal.products?.map((p) => ({
      productId: p.id,
      quantity: p.quantity || 1,
    })) || [],
})

const previewImages = ref<string[]>(props.deal.images || [])
const products = ref<Array<Product & { pivot?: { quantity: number } }>>(props.deal.products || [])

const handleImageUpload = async (files: File[]) => {
  // Create previews
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })

  // Upload images
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await fetch(`/deals/${props.deal.id}/images`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-TOKEN': props.csrfToken,
      'Accept': 'application/json',
    },
    body: formData,
  })
  const images = await response.json()
  previewImages.value = [
    ...previewImages.value.filter((img) => !img.startsWith('data:')),
    ...images.data,
  ]
}

const removeImage = async (url: string) => {
  await fetch(`/deals/${props.deal.id}/images`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRF-TOKEN': props.csrfToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images: [url] }),
  })
  previewImages.value = previewImages.value.filter((image) => image !== url)
}

const removeProduct = (productId: number) => {
  const index = form.products.findIndex((p) => p.productId === productId)
  if (index > -1) {
    form.products.splice(index, 1)
    products.value = products.value.filter((p) => p.id !== productId)
  }
}

const updateQuantity = (productId: number, quantity: number) => {
  const index = form.products.findIndex((p) => p.productId === productId)
  if (index > -1) {
    form.products[index].quantity = Math.max(1, quantity) // Ensure quantity is at least 1
  }
}

const addFeature = () => {
  form.features.push({ label: '', value: '' })
}

const removeFeature = (index: number) => {
  form.features.splice(index, 1)
}

// Debug watchers
watch(() => form.invoiceAvailable, (newVal) => {
  console.log('invoiceAvailable changed to:', newVal)
})

watch(() => form.canBeDelivered, (newVal) => {
  console.log('canBeDelivered changed to:', newVal)
})

const submitForm = () => {
  form
    .transform((data) => ({
      ...data,
      features: data.features.filter((f: { label: string; value: string }) => f.label.trim() || f.value.trim()),
    }))
    .post(`/deals/${props.deal.id}`, {
      // forceFormData: true,
      onSuccess: () => {
        router.visit(`/deals/${props.deal.id}`)
      },
      onError: (errors: Record<string, string>) => {
        // Handle errors - Inertia will automatically set the error bag
        console.error('Error submitting form:', errors)
      },
    })
}

const saveAndAddProduct = () => {
  form
    .transform((data) => ({
      ...data,
      features: data.features.filter((f: { label: string; value: string }) => f.label.trim() || f.value.trim()),
    }))
    .post(`/deals/${props.deal.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        router.visit(`/deals/${props.deal.id}/search-product`)
      },
      onError: (errors: Record<string, string>) => {
        console.error('Error saving form:', errors)
      },
    })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ deal.id ? 'Edit Deal' : 'Create New Deal' }}</h1>

    <form @submit.prevent="submitForm" class="space-y-8">
      <FormSection v-if="deal.status === 'DECLINED'" title="Decline Reason">
        <div class="space-y-4">
          <div class="space-y-2">
            <span class="text-sm text-red-500">{{ deal.reasonDeclined }}</span>
          </div>
        </div>
      </FormSection>
      <!-- Deal Information Card -->
      <FormSection title="Deal Information">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="title" class="block text-sm font-medium text-gray-700">Title *</label>
              <Input
                id="title"
                v-model="form.title"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div class="space-y-2">
              <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
              <Input
                id="location"
                v-model="form.location"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="description" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <Textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            ></Textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
              <div class="flex rounded-md shadow-sm">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  v-model="form.price"
                  required
                  class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <select
                  v-model="form.currency"
                  class="-ml-px rounded-r-md border border-l-0 border-gray-300 bg-gray-50 py-2 pl-3 pr-8 text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label for="condition" class="block text-sm font-medium text-gray-700"
                >Condition</label
              >
              <Select v-model="form.condition" id="condition">
                <SelectTrigger>
                  <SelectValue placeholder="Select a condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Conditions</SelectLabel>
                    <SelectItem value="NEW"> New </SelectItem>
                    <SelectItem value="LIKE_NEW"> Like New </SelectItem>
                    <SelectItem value="GOOD"> Good </SelectItem>
                    <SelectItem value="FAIR"> Fair </SelectItem>
                    <SelectItem value="POOR"> Poor </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Additional Deal Attributes -->
          <div class="space-y-4">
             <div class="flex items-center space-x-6">
               <label class="flex items-center">
                 <input 
                   type="checkbox" 
                   v-model="form.invoiceAvailable"
                   id="invoiceAvailable"
                   class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                 />
                 <span class="ml-2 text-sm text-gray-700">Invoice available</span>
               </label>

               <label class="flex items-center">
                 <input 
                   type="checkbox" 
                   v-model="form.canBeDelivered"
                   id="canBeDelivered"
                   class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                 />
                 <span class="ml-2 text-sm text-gray-700">Can be delivered</span>
               </label>
             </div>

            <div class="space-y-2">
              <label for="sellingReason" class="block text-sm font-medium text-gray-700"
                >Reason for selling</label
              >
              <Textarea
                id="sellingReason"
                v-model="form.sellingReason"
                rows="3"
                placeholder="Why are you selling this item?"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              ></Textarea>
            </div>
          </div>
        </div>
      </FormSection>

      <!-- Products Card -->
      <FormSection title="Products">
        <template #actions>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="saveAndAddProduct"
          >
            Add Product
          </button>
        </template>

        <div>
          <div v-if="products.length > 0" class="space-y-2">
            <div
              v-for="(product, index) in products"
              :key="product.id"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border-b gap-3"
            >
              <div class="flex items-start space-x-4 min-w-0 flex-1">
                <img
                  v-if="product.images?.[0]"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded flex-shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium truncate">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
                </div>
              </div>
              <div class="flex items-center justify-end space-x-4 flex-shrink-0">
                <QuantityInput
                  v-model="form.products[index].quantity"
                  @update:model-value="updateQuantity(product.id, $event)"
                />
                <button
                  type="button"
                  @click="removeProduct(product.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            No products added yet. Click "Add Product" to get started.
          </div>
        </div>
      </FormSection>

      <!-- Images Card -->
      <FormSection title="Images">
        <ImageUploadGrid
          :images="previewImages"
          @upload="handleImageUpload"
          @remove="removeImage"
        />
      </FormSection>

       <!-- Features Card -->
       <FormSection title="Features">
         <div class="space-y-4">
           <div v-for="(feature, index) in form.features" :key="index" class="border rounded-lg p-4">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="space-y-2">
                   <label
                     :for="`feature-label-${index}`"
                     class="block text-sm font-medium text-gray-700"
                     >Feature Label</label
                   >
                   <Input
                     :id="`feature-label-${index}`"
                     v-model="feature.label"
                     placeholder="e.g., Brand, Model, Color"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                   />
                 </div>
               <div class="space-y-2">
                 <label
                   :for="`feature-value-${index}`"
                   class="block text-sm font-medium text-gray-700"
                   >Feature Value</label
                 >
                 <Input
                   :id="`feature-value-${index}`"
                   v-model="feature.value"
                   placeholder="e.g., Apple, iPhone 13, Black"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                 />
               </div>
             </div>
             <div class="mt-4 flex justify-end">
               <button
                 type="button"
                 @click="removeFeature(index)"
                 class="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
               >
                 Remove Feature
               </button>
             </div>
           </div>

           <button
             type="button"
             @click="addFeature"
             class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
           >
             + Add Feature
           </button>
         </div>
       </FormSection>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <Button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Confirm
        </Button>
      </div>
    </form>
  </div>
</template>
