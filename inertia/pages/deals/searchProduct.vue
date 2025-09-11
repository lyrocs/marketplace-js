<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
import { usePage, router } from '@inertiajs/vue3'

const props = defineProps<{
    categories: CategoryDto[]
    specs: SpecDto[]
    products: ProductDto[]
    meta: MetaDto
}>()

const page = usePage()
const queryString = page.url.split('?')[1] || ''
const searchParams = new URLSearchParams(queryString)
const queryParams = Object.fromEntries(searchParams.entries())
const specsParams = queryParams.specs?.split(',').map(Number) || []
const categoryParams = queryParams.category ? Number(queryParams.category) : null

function handleChange(ids: number[]) {
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    url.searchParams.delete('specs')
    if (ids && ids.length) {
        url.searchParams.set('specs', ids.join(','))
    }

    router.get(url.toString())
}

function handleChangeCategory(id: number) {
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    url.searchParams.delete('specs')
    url.searchParams.delete('category')
    if (id) {
        url.searchParams.set('category', id.toString())
    }

    router.get(url.toString())
}

function handleProductSelect(product: ProductDto) {
    console.log('Selected product:', product)
}

onMounted(() => {
    // fetchProducts()
})
</script>
<template>
    <div>
        <h1>Deal Form</h1>
        <Filters @change="handleChange" @change:category="handleChangeCategory" :specs="specs"
            :selectedIds="specsParams" :categories="categories" :category="categoryParams" inline />
        <ProductSelectionList :products="products" @select="handleProductSelect" />
    </div>
</template>
