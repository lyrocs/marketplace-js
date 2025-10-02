<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="divider-wrapper">
    <div class="divider-line" aria-hidden="true">
      <div class="divider-border" />
    </div>
    <div class="divider-text-wrapper">
      <span class="divider-text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.divider-wrapper {
  @apply relative;
}

.divider-line {
  @apply absolute inset-0 flex items-center;
}

.divider-border {
  @apply w-full border-t border-gray-300;
}

.divider-text-wrapper {
  @apply relative flex justify-center text-sm;
}

.divider-text {
  @apply bg-white px-2 text-gray-500;
}
</style>
