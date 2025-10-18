<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>
