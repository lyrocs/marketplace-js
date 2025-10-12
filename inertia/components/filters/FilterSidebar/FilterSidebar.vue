<script setup lang="ts">
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'

interface Props {
  title: string
  specs: SpecDto[]
  selectedIds: number[]
  categories: CategoryDto[]
  category?: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', ids: number[]): void
  (e: 'change:category', id: number): void
}>()
</script>

<template>
  <div class="filter-sidebar">
    <h3 class="filter-sidebar-title">{{ title }}</h3>
    <Filters
      @change="(ids) => emit('change', ids)"
      @change:category="(id) => emit('change:category', id)"
      :inline="false"
      :specs="specs"
      :selected-ids="selectedIds"
      :categories="categories"
      :category="category"
    />
  </div>
</template>

<style scoped>
.filter-sidebar {
  @apply flex flex-col gap-4;
}

.filter-sidebar-title {
  @apply text-xl font-bold text-gray-800;
}
</style>
