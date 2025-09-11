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
    product_ids: props.deal.products?.map(p => p.id) || []
})

const previewImages = ref<string[]>(props.deal.images || [])
const products = ref<Product[]>(props.deal.products || [])

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
    const index = form.product_ids.indexOf(productId)
    if (index > -1) {
        form.product_ids.splice(index, 1)
        products.value = products.value.filter(p => p.id !== productId)
    }
}

const submitForm = () => {
    const url = props.deal.id ? `/deals/${props.deal.id}` : '/deals'

    form.post(url, {
        forceFormData: true,
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
                        <div v-for="product in products" :key="product.id"
                            class="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <h4 class="font-medium">{{ product.name }}</h4>
                                <p v-if="product.description" class="text-sm text-gray-500">
                                    {{ product.description.substring(0, 100) }}{{ product.description.length > 100 ?
                                    '...' : '' }}
                                </p>
                            </div>
                            <button type="button" class="text-sm text-red-600 hover:text-red-900 focus:outline-none"
                                @click="removeProduct(product.id)">
                                Remove
                            </button>
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
                <button type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    {{ deal.id ? 'Update Deal' : 'Create Deal' }}
                </button>
            </div>
        </form>
    </div>
</template>