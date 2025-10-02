<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  images: string[]
  defaultImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultImage: 'https://placehold.co/400x300/475569/white?text=Image',
})

const selectedImageIndex = ref(0)
const productImages = props.images && props.images.length > 0 ? props.images : [props.defaultImage]
</script>

<template>
  <div class="gallery-container">
    <img :src="productImages[selectedImageIndex]" class="gallery-main-image" alt="Image principale du produit" />

    <div v-if="productImages.length > 1" class="gallery-thumbnails">
      <button
        v-for="(image, index) in productImages"
        :key="index"
        @click="selectedImageIndex = index"
        class="gallery-thumbnail"
        :class="selectedImageIndex === index ? 'gallery-thumbnail-active' : 'gallery-thumbnail-inactive'"
      >
        <img :src="image" class="gallery-thumbnail-image" :alt="`Image ${index + 1} du produit`" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery-container {
  @apply rounded-xl bg-white p-4 shadow-lg;
}

.gallery-main-image {
  @apply size-full rounded-lg object-cover;
}

.gallery-thumbnails {
  @apply mt-4 flex gap-2 overflow-x-auto;
}

.gallery-thumbnail {
  @apply flex-shrink-0 rounded-lg border-2 transition-all;
}

.gallery-thumbnail-active {
  @apply border-slate-600 ring-2 ring-slate-300;
}

.gallery-thumbnail-inactive {
  @apply border-transparent hover:border-slate-300;
}

.gallery-thumbnail-image {
  @apply h-20 w-20 rounded-lg object-cover;
}
</style>
