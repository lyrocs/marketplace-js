<script setup lang="ts">
interface Props {
  iconClass?: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <div class="feature-icon">
      <slot />
    </div>
    <h3 class="feature-icon-title">
      <slot name="title" />
    </h3>
    <p class="feature-icon-description">
      <slot name="description" />
    </p>
  </div>
</template>

<style scoped>
.feature-icon {
  @apply mx-auto text-5xl text-slate-500 flex justify-center;
}

.feature-icon-title {
  @apply mt-4 text-xl font-bold text-gray-800;
}

.feature-icon-description {
  @apply mt-1 text-gray-600;
}
</style>
