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
  <div class="error-banner">
    <IconCloudAlertOutline class="error-icon" />
    <div class="error-content">
      <p class="error-title">{{ title }}</p>
      <p class="error-message">{{ error }}</p>
    </div>
    <button @click="emit('dismiss')" class="error-dismiss">
      <IconCloseSmall class="text-xl" />
    </button>
  </div>
</template>

<style scoped>
.error-banner {
  @apply mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3;
}

.error-icon {
  @apply text-red-500 text-xl flex-shrink-0;
}

.error-content {
  @apply flex-grow;
}

.error-title {
  @apply text-red-800 font-medium;
}

.error-message {
  @apply text-red-600 text-sm;
}

.error-dismiss {
  @apply text-red-500 hover:text-red-700 transition-colors;
}
</style>
