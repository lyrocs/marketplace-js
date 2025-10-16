<script setup lang="ts">
const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-xl group"
  >
    <div
      class="h-48 w-full flex items-center justify-center bg-gray-50 transition-colors duration-300 group-hover:bg-blue-50"
    >
      <div class="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
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
    <div class="flex grow flex-col p-4">
      <h3
        class="my-2 h-14 text-lg font-bold text-gray-800 hover:text-slate-600 overflow-hidden flex items-center justify-center"
      >
        {{ $t('product.createNew') }}
      </h3>
      <div class="flex-1 flex items-center justify-center text-center">
        <p class="text-sm text-gray-600">{{ $t('product.createNewDescription') }}</p>
      </div>
      <div class="flex-1 flex flex-col items-center justify-end gap-2 mt-4">
        <Button @click="emit('create')" variant="default" class="w-full">
          {{ $t('product.createProduct') }}
        </Button>
      </div>
    </div>
  </div>
</template>
