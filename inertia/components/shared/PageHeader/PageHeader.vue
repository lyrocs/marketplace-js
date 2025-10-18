<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
            <p v-if="subtitle" class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
          </div>
        </div>

        <div v-if="$slots.actions" class="flex items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
