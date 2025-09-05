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

const selectedSpecId = ref('')

function addSpec() {
    const id = Number(selectedSpecId.value)
    if (id && !form.value.specs.includes(id)) {
        form.value.specs.push(id)
        selectedSpecId.value = ''
    }
}

function removeSpec(id: number) {
    form.value.specs = form.value.specs.filter(sid => sid !== id)
}

const newImage = ref('')

function addImage() {
    if (newImage.value && !form.value.images.includes(newImage.value)) {
        form.value.images.push(newImage.value)
        newImage.value = ''
    }
}

function removeImage(idx: number) {
    form.value.images.splice(idx, 1)
}

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
                    :messages="messages" :isEdit="true" @submit="updateProduct">
                </ProductForm>
            </div>
        </div>
    </div>
</template>