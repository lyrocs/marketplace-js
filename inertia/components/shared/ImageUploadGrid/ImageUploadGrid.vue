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
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    <div v-for="(image, index) in images" :key="index" class="relative group">
      <img :src="image" class="w-full h-32 object-cover rounded-md" />
      <button
        type="button"
        @click="emit('remove', image)"
        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>

    <label
      class="flex items-center justify-center border-2 border-dashed rounded-md h-32 cursor-pointer hover:bg-gray-50"
    >
      <div class="text-center p-4">
        <span class="block text-gray-400">+ Add Image</span>
        <input type="file" class="hidden" accept="image/*" multiple @change="handleImageUpload" />
      </div>
    </label>
  </div>
</template>
