<script setup lang="ts">
import { IconCloudAlertOutline, IconCloseSmall } from '@iconify-prerendered/vue-material-symbols'

interface Props {
  error: string
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Erreur de connexion',
})

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
    <IconCloudAlertOutline class="text-red-500 text-xl flex-shrink-0" />
    <div class="flex-grow">
      <p class="text-red-800 font-medium">{{ title }}</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
    </div>
    <button @click="emit('dismiss')" class="text-red-500 hover:text-red-700 transition-colors">
      <IconCloseSmall class="text-xl" />
    </button>
  </div>
</template>
