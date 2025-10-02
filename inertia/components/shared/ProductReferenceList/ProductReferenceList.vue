<script setup lang="ts">
import { IconArrowForwardIos } from '@iconify-prerendered/vue-material-symbols'

interface Product {
  id: number
  name: string
  brand?: string
  description?: string
  images?: string[]
  price?: number
  currency?: string
  quantity?: number
}

interface Props {
  products: Product[]
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Produit(s) de référence du catalogue',
  subtitle: 'Cette annonce est composée des produits officiels suivants.',
})
</script>

<template>
  <div class="product-ref-card">
    <h2 class="product-ref-title">{{ title }}</h2>
    <p class="product-ref-subtitle">{{ subtitle }}</p>
    <div class="product-ref-list">
      <div v-for="product in products" :key="product.id" class="product-ref-item">
        <img
          v-if="product.images?.[0]"
          :src="product.images[0]"
          :alt="product.name"
          class="product-ref-image"
        />
        <div class="product-ref-info">
          <span v-if="product.brand" class="product-ref-brand">{{ product.brand }}</span>
          <h4 class="product-ref-name">{{ product.name }}</h4>
          <p v-if="product.description" class="product-ref-description">{{ product.description }}</p>
        </div>
        <a href="#" class="product-ref-link" title="Voir la fiche officielle">
          <IconArrowForwardIos class="text-3xl" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-ref-card {
  @apply bg-white rounded-xl shadow-lg p-6 md:p-8;
}

.product-ref-title {
  @apply text-2xl font-bold text-gray-800;
}

.product-ref-subtitle {
  @apply text-sm text-gray-500 mt-1;
}

.product-ref-list {
  @apply mt-6 space-y-4;
}

.product-ref-item {
  @apply flex items-center gap-4 border border-slate-200 rounded-lg p-3 hover:bg-slate-50 hover:shadow-sm transition-all;
}

.product-ref-image {
  @apply w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md object-cover;
}

.product-ref-info {
  @apply flex-grow;
}

.product-ref-brand {
  @apply text-xs font-semibold text-gray-500;
}

.product-ref-name {
  @apply font-bold text-gray-800 leading-tight;
}

.product-ref-description {
  @apply text-sm text-gray-600 mt-1 hidden sm:block;
}

.product-ref-link {
  @apply flex-shrink-0 ml-4 text-slate-400 hover:text-slate-700;
}
</style>
