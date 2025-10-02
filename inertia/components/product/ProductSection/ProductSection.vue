<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="product-section">
    <h2 class="product-section-title">{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped>
.product-section {
  @apply rounded-xl bg-white p-6 shadow-lg md:p-8;
}

.product-section-title {
  @apply text-2xl font-bold text-gray-800;
}
</style>
