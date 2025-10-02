<script setup lang="ts">
interface Props {
  isConnected: boolean
  isLoading: boolean
  hasError: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="connection-status">
    <div class="status-indicator" :class="{
      'bg-green-500': isConnected,
      'bg-yellow-500': isLoading,
      'bg-red-500': hasError && !isLoading
    }"></div>
    <span class="status-text">
      {{ isConnected ? 'Connecté' : isLoading ? 'Connexion...' : 'Déconnecté' }}
    </span>
  </div>
</template>

<style scoped>
.connection-status {
  @apply flex items-center gap-2;
}

.status-indicator {
  @apply w-2 h-2 rounded-full;
}

.status-text {
  @apply text-sm text-gray-600;
}
</style>
