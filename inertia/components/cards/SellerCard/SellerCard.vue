<script setup lang="ts">
import {
  IconLocationOnOutline,
  IconHandshakeOutline,
} from '@iconify-prerendered/vue-material-symbols'

interface Seller {
  name: string
  avatar: string
  location: string
}

interface Props {
  seller: Seller
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h3 class="font-bold text-lg text-gray-800 mb-3">Vendeur et modalités</h3>
    <div class="flex items-center gap-4">
      <img :src="seller.avatar" alt="avatar" class="w-16 h-16 rounded-full" />
      <div>
        <a href="#" class="font-semibold text-gray-800 hover:text-slate-600">{{ seller.name }}</a>
        <div class="mt-1">
          <slot name="rating" />
        </div>
      </div>
    </div>
    <div class="text-sm text-gray-600 space-y-3 mt-4 pt-4 border-t">
      <div class="flex items-center gap-2">
        <IconLocationOnOutline class="text-lg" />
        <span>Situé à {{ seller.location }}</span>
      </div>
    </div>
  </div>
</template>
