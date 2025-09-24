<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import ProductDto from '#dtos/product'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
defineOptions({
    layout: AdminLayout
})

const props = defineProps<{
    product: ProductDto
    specs: SpecDto[]
    categories: CategoryDto[]
    brands: BrandDto[]
    s3BaseUrl: string
}>()
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const form = ref({
    name: props.product.name,
    status: props.product.status,
    images: Array.isArray(props.product.images) ? [...props.product.images] : [],
    specs: props.product.specs ? props.product.specs.map(s => s.id) : [],
    category_id: props.product.category_id || props.product.category?.id || '',
    brand_id: props.product.brand_id || props.product.brand?.id || '',
    description: props.product.description,
    features: props.product.features || [],
})

function updateProduct() {
    router.put(`/admin/product/${props.product.id}`,
        {
            ...form.value,
            category_id: form.value.category_id,
            brand_id: form.value.brand_id,
        }
    )
    messages.value.success = 'Product updated successfully'
}

async function uploadImage() {
    router.post(`/admin/product/${props.product.id}/images`, {
        imageUrls: form.value.images,
    })
}

const messages = ref({
    success: '',
    errorsBag: {},
})

</script>

<template>
    <div class=" mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-6">Edit Product</h1>
        <ToastManager :messages="messages" />
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left column: Global info -->
            <div class="flex-1 min-w-0">
                <ProductForm v-model="form" :specs="props.specs" :categories="props.categories" :brands="props.brands"
                    :messages="messages" :isEdit="true" :s3BaseUrl="s3BaseUrl" @submit="updateProduct"
                    @upload-image="uploadImage">
                </ProductForm>
            </div>
        </div>
    </div>
</template>