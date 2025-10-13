<script setup lang="ts">
import ProductDto from '#dtos/product'
import CategoryDto from '#dtos/category'

const props = defineProps<{
  product: ProductDto
  categories: CategoryDto[]
}>()
</script>

<template>
  <main class="container mx-auto bg-slate-100/50 px-4 py-8 md:py-12">
    <ProductDetails :product="product" :categories="categories" />
  </main>
</template>
