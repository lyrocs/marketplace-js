<script setup lang="ts">
import { ref } from 'vue'
import ProductDto from '#dtos/product'

const props = defineProps<{
    products: ProductDto[]
}>()

const emit = defineEmits(['select'])

const selectedProduct = ref<ProductDto | null>(null)

const handleSelect = (product: ProductDto) => {
    selectedProduct.value = product
    emit('select', product)
}
</script>

<template>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <li v-for="product in props.products" :key="product.id"
            class="border bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <div class="flex gap-4">
                <div class="flex-shrink-0">
                    <img :src="product.images[0]" alt="" class="w-24 h-24 object-cover rounded">
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-semibold text-lg">{{ product.name }}</h3>
                        <p class="text-sm text-gray-600">{{ product.category.name }} -
                            {{ product.brand?.name || 'No brand' }}</p>

                        <ul class="flex flex-wrap gap-1 mt-2">
                            <li v-for="spec in product.specs.slice(0, 3)" :key="spec.id">
                                <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {{ spec.type.label }}: {{ spec.value }}
                                </span>
                            </li>
                            <li v-if="product.specs.length > 3" class="text-xs text-gray-500">
                                +{{ product.specs.length - 3 }} more
                            </li>
                        </ul>
                    </div>

                    <div class="mt-4 flex justify-end">
                        <button @click="handleSelect(product)"
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            :class="{ 'bg-blue-700': selectedProduct?.id === product.id }">
                            {{ selectedProduct?.id === product.id ? 'Selected' : 'Select' }}
                        </button>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>
