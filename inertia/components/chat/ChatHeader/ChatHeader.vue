<script setup lang="ts">
interface Props {
  isConnected: boolean
  isLoading: boolean
  hasError: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="p-4 border-b flex justify-between items-center flex-shrink-0">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold text-gray-800">Messagerie</h1>
      <ConnectionStatus :is-connected="isConnected" :is-loading="isLoading" :has-error="hasError" />
    </div>

    <div v-if="isLoading" class="flex items-center gap-2 text-gray-600">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
      <span class="text-sm">Chargement...</span>
    </div>
  </div>
</template>
