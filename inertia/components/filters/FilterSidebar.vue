<script setup lang="ts">
import SpecDto from '#dtos/spec'

interface Props {
  title: string
  specs: SpecDto[]
  selectedIds: number[]
}

defineProps<Props>()

const emit = defineEmits<{
  change: [ids: number[]]
}>()
</script>

<template>
  <div class="filter-sidebar">
    <h3 class="filter-sidebar-title">{{ title }}</h3>
    <Filters @change="(ids) => emit('change', ids)" :specs="specs" :selected-ids="selectedIds" />
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
