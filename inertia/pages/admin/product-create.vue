<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import ProductForm from '~/components/ui/ProductForm.vue'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'

defineOptions({ layout: AdminLayout })

const props = defineProps<{
  specs: SpecDto[],
  categories: CategoryDto[],
  brands: BrandDto[],
}>()

const form = ref({
  name: '',
  status: 'PENDING',
  images: [],
  specs: [],
  category_id: '',
  brand_id: '',
})

const translations = ref([])
const messages = ref({ success: '', errorsBag: {} })

function createProduct() {
  router.post('/admin/product', { ...form.value, translations: translations.value })
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
      :translations="translations"
      :messages="messages"
      :isEdit="false"
      @submit="createProduct"
    >
      <template #translations>
        <!-- Add translation fields here if needed, or refactor translation logic into the form if desired -->
      </template>
    </ProductForm>
  </div>
</template>
