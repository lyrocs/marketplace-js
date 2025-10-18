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
  <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
    <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
    <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    <div class="mt-6 space-y-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center gap-4 border border-slate-200 rounded-lg p-3 hover:bg-slate-50 hover:shadow-sm transition-all"
      >
        <img
          v-if="product.images?.[0]"
          :src="product.images[0]"
          :alt="product.name"
          class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md object-cover"
        />
        <div class="flex-grow">
          <span v-if="product.brand" class="text-xs font-semibold text-gray-500">{{
            product.brand
          }}</span>
          <h4 class="font-bold text-gray-800 leading-tight">{{ product.name }}</h4>
          <p v-if="product.description" class="text-sm text-gray-600 mt-1 hidden sm:block">
            {{ product.description }}
          </p>
        </div>
        <a
          href="#"
          class="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-700"
          title="Voir la fiche officielle"
        >
          <IconArrowForwardIos class="text-3xl" />
        </a>
      </div>
    </div>
  </div>
</template>
