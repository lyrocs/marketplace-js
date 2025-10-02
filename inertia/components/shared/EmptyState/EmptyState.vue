<script setup lang="ts">
interface Props {
  title: string
  message: string
}

defineProps<Props>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-container">
      <div class="empty-state-icon">
        <slot name="icon">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </slot>
      </div>

      <h3 class="empty-state-title">{{ title }}</h3>
      <p class="empty-state-message">{{ message }}</p>

      <div v-if="$slots.actions" class="empty-state-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  @apply text-center py-16;
}

.empty-state-container {
  @apply max-w-md mx-auto;
}

.empty-state-icon {
  @apply w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4;
}

.empty-state-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.empty-state-message {
  @apply text-gray-600 mb-6;
}

.empty-state-actions {
  @apply flex flex-col sm:flex-row gap-3 justify-center;
}
</style>
