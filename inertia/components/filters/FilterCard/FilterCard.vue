<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="rounded-xl bg-white p-6 shadow-lg">
    <h3 class="mb-4 text-lg font-semibold text-gray-800 capitalize">{{ title }}</h3>
    <div class="space-y-3">
      <slot />
    </div>
  </div>
</template>
