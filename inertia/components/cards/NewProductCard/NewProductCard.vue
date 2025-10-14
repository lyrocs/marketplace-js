<script setup lang="ts">
const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="new-product-card group">
    <div class="new-product-card-image">
      <div class="new-product-card-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    </div>
    <div class="new-product-card-content">
      <h3 class="new-product-card-title">{{ $t('product.createNew') }}</h3>
      <div class="new-product-card-description">
        <p>{{ $t('product.createNewDescription') }}</p>
      </div>
      <div class="new-product-card-actions">
        <Button @click="emit('create')" variant="default" class="w-full">
          {{ $t('product.createProduct') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-product-card {
  @apply flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-xl;
}

.new-product-card-image {
  @apply h-48 w-full flex items-center justify-center bg-gray-50 transition-colors duration-300 group-hover:bg-blue-50;
}

.new-product-card-icon {
  @apply text-gray-400 group-hover:text-blue-500 transition-colors duration-300;
}

.new-product-card-content {
  @apply flex grow flex-col p-4;
}

.new-product-card-title {
  @apply my-2 h-14 text-lg font-bold text-gray-800 hover:text-slate-600 overflow-hidden flex items-center justify-center;
}

.new-product-card-description {
  @apply flex-1 flex items-center justify-center text-center;
}

.new-product-card-description p {
  @apply text-sm text-gray-600;
}

.new-product-card-actions {
  @apply flex-1 flex flex-col items-center justify-end gap-2 mt-4;
}
</style>
