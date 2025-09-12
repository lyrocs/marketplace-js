<script setup lang="ts">
import { ref } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import DealDto from '#dtos/deal'
import ProductDto from '#dtos/product'

// Define interfaces for our form data
interface Product extends Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'> {
    id: number
    name: string
    description?: string
}

const props = defineProps<{ deal: DealDto }>()

const form = useForm({
    _method: props.deal.id ? 'put' : 'post',
    title: props.deal.title || '',
    description: props.deal.description || '',
    price: props.deal.price || '',
    currency: props.deal.currency || 'EUR',
    location: props.deal.location || '',
    images: [] as File[],
    products: props.deal.products?.map(p => ({
        productId: p.id,
        quantity: p.quantity || 1
    })) || []
})

const previewImages = ref<string[]>(props.deal.images || [])
const products = ref<Array<Product & { pivot?: { quantity: number } }>>(props.deal.products || [])

const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (!target.files?.length) return

    const newImages = Array.from(target.files)
    form.images = [...form.images, ...newImages]

    // Create previews
    newImages.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImages.value.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    })
}

const removeImage = (index: number) => {
    if (index < previewImages.value.length - form.images.length) {
        // Remove existing image
        previewImages.value.splice(index, 1)
    } else {
        // Remove newly added image
        const newIndex = index - (previewImages.value.length - form.images.length)
        form.images.splice(newIndex, 1)
        previewImages.value.splice(index, 1)
    }
}

const removeProduct = (productId: number) => {
    const index = form.products.findIndex(p => p.productId === productId)
    if (index > -1) {
        form.products.splice(index, 1)
        products.value = products.value.filter(p => p.id !== productId)
    }
}

const updateQuantity = (productId: number, quantity: number) => {
    const index = form.products.findIndex(p => p.productId === productId)
    if (index > -1) {
        form.products[index].quantity = Math.max(1, quantity) // Ensure quantity is at least 1
    }
}

const submitForm = () => {
    form.post(`/deals/${props.deal.id}`, {
        // forceFormData: true,
        onSuccess: () => {
            // Handle success - Inertia will automatically handle the redirect if the response includes one
        },
        onError: (errors: Record<string, string>) => {
            // Handle errors - Inertia will automatically set the error bag
            console.error('Error submitting form:', errors)
        }
    })
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">{{ deal.id ? 'Edit Deal' : 'Create New Deal' }}</h1>

        <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Deal Information Card -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Deal Information</h2>
                </div>
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label for="title" class="block text-sm font-medium text-gray-700">Title *</label>
                            <input id="title" v-model="form.title" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>

                        <div class="space-y-2">
                            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                            <input id="location" v-model="form.location"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" v-model="form.description" rows="4"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
                            <div class="flex rounded-md shadow-sm">
                                <input id="price" type="number" step="0.01" min="0" v-model="form.price" required
                                    class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                                <select v-model="form.currency"
                                    class="-ml-px rounded-r-md border border-l-0 border-gray-300 bg-gray-50 py-2 pl-3 pr-8 text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
                                    <option value="EUR">€ EUR</option>
                                    <option value="USD">$ USD</option>
                                    <option value="GBP">£ GBP</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Card -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-medium text-gray-900">Products</h2>
                    <button type="button"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        @click="router.visit(`/deals/${deal.id || 'new'}/search-product`)">
                        Add Product
                    </button>
                </div>
                <div class="p-6">
                    <div v-if="products.length > 0" class="space-y-2">
                        <div v-for="(product, index) in products" :key="product.id"
                            class="flex items-center justify-between p-3 border-b">
                            <div class="flex items-center space-x-4">
                                <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name"
                                    class="w-12 h-12 object-cover rounded" />
                                <div>
                                    <h3 class="font-medium">{{ product.name }}</h3>
                                    <p class="text-sm text-gray-500">{{ product.description }}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center">
                                    <button type="button"
                                        @click="updateQuantity(product.id, form.products[index].quantity - 1)"
                                        class="px-2 py-1 border rounded-l-md hover:bg-gray-100"
                                        :disabled="form.products[index].quantity <= 1">
                                        -
                                    </button>
                                    <input type="number" v-model.number="form.products[index].quantity"
                                        @change="updateQuantity(product.id, form.products[index].quantity)" min="1"
                                        class="w-16 text-center border-t border-b border-gray-300 py-1" />
                                    <button type="button"
                                        @click="updateQuantity(product.id, form.products[index].quantity + 1)"
                                        class="px-2 py-1 border rounded-r-md hover:bg-gray-100">
                                        +
                                    </button>
                                </div>
                                <button type="button" @click="removeProduct(product.id)"
                                    class="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-6 text-gray-500">
                        No products added yet. Click "Add Product" to get started.
                    </div>
                </div>
            </div>

            <!-- Images Card -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Images</h2>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div v-for="(image, index) in previewImages" :key="index" class="relative group">
                            <img :src="image" class="w-full h-32 object-cover rounded-md" />
                            <button type="button" @click="removeImage(index)"
                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                ×
                            </button>
                        </div>

                        <label
                            class="flex items-center justify-center border-2 border-dashed rounded-md h-32 cursor-pointer hover:bg-gray-50">
                            <div class="text-center p-4">
                                <span class="block text-gray-400">+ Add Image</span>
                                <input type="file" class="hidden" accept="image/*" multiple
                                    @change="handleImageUpload" />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <Button type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    {{ deal.id ? 'Update Deal' : 'Create Deal' }}
                </Button>
            </div>
        </form>
    </div>
</template>