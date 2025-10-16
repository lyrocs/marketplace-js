<script setup lang="ts">
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'

interface Props {
  title?: string
  specs?: SpecDto[]
  selectedIds: number[]
  categories: CategoryDto[]
  category?: string
  showSearch?: boolean
  search?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', ids: number[]): void
  (e: 'change:category', id: number): void
  (e: 'change:search', search: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
    <Filters
      @change="(ids) => emit('change', ids)"
      @change:category="(id) => emit('change:category', id)"
      @change:search="(search) => emit('change:search', search)"
      :inline="false"
      :specs="specs"
      :selected-ids="selectedIds"
      :categories="categories"
      :category="category"
      :show-search="showSearch"
      :search="search"
    />
  </div>
</template>
