<script setup lang="ts">
interface Props {
  isConnected: boolean
  isLoading: boolean
  hasError: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      class="w-2 h-2 rounded-full"
      :class="{
        'bg-green-500': isConnected,
        'bg-yellow-500': isLoading,
        'bg-red-500': hasError && !isLoading,
      }"
    ></div>
    <span class="text-sm text-gray-600">
      {{ isConnected ? 'Connecté' : isLoading ? 'Connexion...' : 'Déconnecté' }}
    </span>
  </div>
</template>
