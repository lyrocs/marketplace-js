<script setup lang="ts">
interface Props {
  isConnected: boolean
  isLoading: boolean
  hasError: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="chat-header">
    <div class="chat-header-left">
      <h1 class="chat-title">Messagerie</h1>
      <ConnectionStatus :is-connected="isConnected" :is-loading="isLoading" :has-error="hasError" />
    </div>

    <div v-if="isLoading" class="chat-header-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Chargement...</span>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  @apply p-4 border-b flex justify-between items-center flex-shrink-0;
}

.chat-header-left {
  @apply flex items-center gap-3;
}

.chat-title {
  @apply text-2xl font-bold text-gray-800;
}

.chat-header-loading {
  @apply flex items-center gap-2 text-gray-600;
}

.loading-spinner {
  @apply animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700;
}

.loading-text {
  @apply text-sm;
}
</style>
