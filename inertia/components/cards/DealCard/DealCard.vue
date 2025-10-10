<script setup lang="ts">
import { computed } from 'vue'
import DealDto from '#dtos/deal'

const props = defineProps<{
  deal: DealDto
}>()

const currencySymbol = computed(() => {
  return props.deal.currency === 'EUR' ? '€' : '$'
})

const firstProductImage = computed(() => {
  return (
    props.deal.products[0]?.images?.[0] || 'https://placehold.co/400x300/475569/white?text=Deal'
  )
})
</script>

<template>
  <div
    class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
  >
    <img
      :src="firstProductImage"
      class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      :alt="`${deal.title} deal image`"
    />

    <div class="flex flex-col p-4 flex-1">
      <!-- Deal title and location -->
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold text-gray-800 hover:text-slate-600 line-clamp-2">
          {{ deal.title }}
        </h3>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 whitespace-nowrap"
        >
          {{ deal.location }}
        </span>
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ deal.description }}</p>

      <div class="mt-auto">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
        <ul class="space-y-1">
          <li
            v-for="product in deal.products"
            :key="product.id"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">{{ product.quantity }}x {{ product.name }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div>
          <span class="text-xs text-gray-500">Total Price:</span>
          <p class="text-xl font-bold text-gray-900">{{ deal.price }} {{ currencySymbol }}</p>
        </div>
        <Button as-child>
          <a :href="`/deals/${deal.id}`"> View Deal </a>
        </Button>
      </div>

      <!-- Vendeur -->
      <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img
            :src="
              deal.user?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.user?.name || 'User')}&background=6366f1&color=fff&size=32`
            "
            :alt="deal.user?.name || 'Vendeur'"
            class="w-6 h-6 rounded-full"
          />
          <span class="text-sm text-gray-600">{{ deal.user?.name || 'Vendeur' }}</span>
        </div>
        <a
          :href="`/user/${deal.user_id}`"
          class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          @click.stop
        >
          Voir profil
        </a>
      </div>
    </div>
  </div>
</template>
