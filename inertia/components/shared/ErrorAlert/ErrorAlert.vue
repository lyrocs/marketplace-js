<script setup lang="ts">
interface Props {
  errors?: Record<string, string>
}

defineProps<Props>()
</script>

<template>
  <div v-if="errors && Object.keys(errors).length > 0" class="error-alert-container">
    <div v-for="(error, index) in errors" :key="index" class="error-alert">
      <div class="error-alert-content">
        <div class="error-alert-icon">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="error-alert-text">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-alert-container {
  @apply mt-4 w-full max-w-md mx-auto;
}

.error-alert {
  @apply bg-red-50 border-l-4 border-red-400 p-4 mb-4;
}

.error-alert-content {
  @apply flex;
}

.error-alert-icon {
  @apply flex-shrink-0;
}

.error-alert-text {
  @apply ml-3;
}
</style>
