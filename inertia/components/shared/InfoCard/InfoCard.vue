<script setup lang="ts">
import {
  IconInfoOutlineRounded,
  IconWarningOutline,
} from '@iconify-prerendered/vue-material-symbols'

defineProps<{
  title: string
  description?: string
  type?: 'info' | 'error'
}>()
</script>

<template>
  <div
    class="p-4 border border-blue-200 rounded-md"
    :class="type === 'error' ? 'bg-destructive' : 'bg-secondary '"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <IconWarningOutline v-if="type === 'error'" class="h-5 w-5 text-destructive-foreground" />
        <IconInfoOutlineRounded v-else class="h-5 w-5 text-secondary-foreground" />
      </div>
      <div class="ml-3">
        <h3
          class="text-sm font-medium"
          :class="type === 'error' ? 'text-destructive-foreground' : 'text-secondary-foreground'"
        >
          {{ title }}
        </h3>
        <div
          class="mt-2 text-sm"
          :class="type === 'error' ? 'text-destructive-foreground' : 'text-secondary-foreground'"
        >
          <p>{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
