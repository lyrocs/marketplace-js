<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import DealDto from '#dtos/deal'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import BrandDto from '#dtos/brand'

const props = defineProps<{
  deal: DealDto
  categories: CategoryDto[]
  specs: SpecDto[]
  brands: BrandDto[]
}>()

const form = ref({
  name: '',
  images: [],
  specs: [],
  category_id: '',
  brand_id: '',
  description: '',
  features: [],
})

const messages = ref({ success: '', errorsBag: {} })
const isLoading = ref(false)

function createProduct() {
  isLoading.value = true
  router.post(`/deals/${props.deal.id}/create-product`, form.value)
}

function goBack() {
  router.get(`/deals/${props.deal.id}/search-product`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('product.createNew') }}</h1>
            <p class="mt-2 text-gray-600">{{ $t('product.createNewDescription') }}</p>
          </div>
          <Button @click="goBack" variant="outline">
            {{ $t('common.back') }}
          </Button>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-if="messages.success"
        class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
      >
        {{ messages.success }}
      </div>

      <div
        v-if="Object.keys(messages.errorsBag).length > 0"
        class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        <ul class="list-disc list-inside">
          <li v-for="(error, field) in messages.errorsBag" :key="field">
            {{ error }}
          </li>
        </ul>
      </div>

      <!-- Form -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-8">
          <UserProductForm
            v-model="form"
            :specs="props.specs"
            :categories="props.categories"
            :brands="props.brands"
            :messages="messages"
            :isEdit="false"
            :s3BaseUrl="''"
            @submit="createProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template>
