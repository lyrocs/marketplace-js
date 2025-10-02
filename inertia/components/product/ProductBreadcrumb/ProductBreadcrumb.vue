<script setup lang="ts">
interface Props {
  breadcrumb: string
  title: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <span class="breadcrumb">{{ breadcrumb }}</span>
    <h1 class="product-title">{{ title }}</h1>
  </div>
</template>

<style scoped>
.breadcrumb {
  @apply text-sm font-medium text-slate-600;
}

.product-title {
  @apply mt-1 text-4xl font-bold text-gray-800 md:text-5xl;
}
</style>
