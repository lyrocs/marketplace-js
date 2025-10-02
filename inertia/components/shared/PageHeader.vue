<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="page-header">
    <div class="page-header-container">
      <div class="page-header-content">
        <div class="page-header-text">
          <div>
            <h1 class="page-header-title">{{ title }}</h1>
            <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div v-if="$slots.actions" class="page-header-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  @apply bg-white border-b border-gray-200 shadow-sm;
}

.page-header-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.page-header-content {
  @apply py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4;
}

.page-header-text {
  @apply flex items-center gap-4;
}

.page-header-title {
  @apply text-3xl font-bold text-gray-900;
}

.page-header-subtitle {
  @apply mt-2 text-sm text-gray-600;
}

.page-header-actions {
  @apply flex items-center gap-3;
}
</style>
