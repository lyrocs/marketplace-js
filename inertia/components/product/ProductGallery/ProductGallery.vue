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
  <div class="rounded-xl bg-white p-4 shadow-lg">
    <img
      :src="productImages[selectedImageIndex]"
      class="size-full rounded-lg object-cover"
      alt="Image principale du produit"
    />

    <div v-if="productImages.length > 1" class="mt-4 flex gap-2 overflow-x-auto">
      <button
        v-for="(image, index) in productImages"
        :key="index"
        @click="selectedImageIndex = index"
        class="flex-shrink-0 rounded-lg border-2 transition-all"
        :class="
          selectedImageIndex === index
            ? 'border-slate-600 ring-2 ring-slate-300'
            : 'border-transparent hover:border-slate-300'
        "
      >
        <img
          :src="image"
          class="h-20 w-20 rounded-lg object-cover"
          :alt="`Image ${index + 1} du produit`"
        />
      </button>
    </div>
  </div>
</template>
