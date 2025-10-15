<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
import ProductStatus from '#enums/product_status'

defineOptions({ layout: AdminLayout })

const props = defineProps<{
  specs: SpecDto[]
  categories: CategoryDto[]
  brands: BrandDto[]
}>()

const form = ref({
  name: '',
  status: ProductStatus.DRAFT,
  images: [],
  specs: [],
  category_id: '',
  brand_id: '',
  description: '',
  features: [],
})

const messages = ref({ success: '', errorsBag: {} })

function createProduct(values: any) {
  router.post('/admin/product', values)
  messages.value.success = 'Product created successfully'
}
</script>

<template>
  <div class="mx-auto bg-white p-6 rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Create Product</h1>
    <ToastManager :messages="messages" />
    <ProductForm
      v-model="form"
      :specs="props.specs"
      :categories="props.categories"
      :brands="props.brands"
      :messages="messages"
      :isEdit="false"
      @submit="createProduct"
    >
    </ProductForm>
  </div>
</template>
