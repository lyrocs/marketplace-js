<script setup lang="ts">
interface Props {
  images: string[]
}

defineProps<Props>()

const emit = defineEmits<{
  upload: [files: File[]]
  remove: [url: string]
}>()

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files?.length) return

  const files = Array.from(target.files)
  emit('upload', files)

  // Reset input so the same file can be selected again
  target.value = ''
}
</script>

<template>
  <div class="image-grid">
    <div v-for="(image, index) in images" :key="index" class="image-preview group">
      <img :src="image" class="image-preview-img" />
      <button type="button" @click="emit('remove', image)" class="image-remove-btn">
        ×
      </button>
    </div>

    <label class="image-upload-label">
      <div class="image-upload-content">
        <span class="image-upload-text">+ Add Image</span>
        <input type="file" class="hidden" accept="image/*" multiple @change="handleImageUpload" />
      </div>
    </label>
  </div>
</template>

<style scoped>
.image-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4;
}

.image-preview {
  @apply relative;
}

.image-preview-img {
  @apply w-full h-32 object-cover rounded-md;
}

.image-remove-btn {
  @apply absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity;
}

.image-upload-label {
  @apply flex items-center justify-center border-2 border-dashed rounded-md h-32 cursor-pointer hover:bg-gray-50;
}

.image-upload-content {
  @apply text-center p-4;
}

.image-upload-text {
  @apply block text-gray-400;
}
</style>
