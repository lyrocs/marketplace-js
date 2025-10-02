<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="form-section">
    <div class="form-section-header">
      <h2 class="form-section-title">{{ title }}</h2>
      <div v-if="$slots.actions" class="form-section-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="form-section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.form-section {
  @apply bg-white shadow rounded-lg overflow-hidden;
}

.form-section-header {
  @apply px-6 py-5 border-b border-gray-200 flex items-center justify-between;
}

.form-section-title {
  @apply text-lg font-medium text-gray-900;
}

.form-section-actions {
  @apply flex items-center gap-2;
}

.form-section-content {
  @apply p-6;
}
</style>
