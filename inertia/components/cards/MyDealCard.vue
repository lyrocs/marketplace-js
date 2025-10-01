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
  return props.deal.products?.[0]?.images?.[0] || 'https://placehold.co/400x300/64748b/white?text=Deal'
})

const statusVariant = computed(() => {
  const status = props.deal.status?.toLowerCase()
  switch (status) {
    case 'active':
    case 'published':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'sold':
    case 'completed':
      return 'outline'
    case 'cancelled':
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
})

const messageCount = computed(() => {
  // Calculate total messages from discussions (placeholder logic)
  return props.deal.discussions?.length || 0
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const totalProducts = computed(() => {
  return props.deal.products?.reduce((total, product) => total + (product.quantity || 1), 0) || 0
})
</script>

<template>
  <Card
    class="flex flex-col group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
    <!-- Image Header -->
    <div class="relative overflow-hidden">
      <img :src="firstProductImage"
        class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        :alt="`${deal.title} deal image`">

      <!-- Status and Message Badges -->
      <div class="absolute top-3 right-3 flex flex-col gap-2">
        <Badge :variant="statusVariant" class="shadow-sm capitalize font-medium">
          {{ deal.status }}
        </Badge>

        <Badge v-if="messageCount > 0" variant="default" class="bg-green-500 hover:bg-green-600 shadow-sm">
          {{ messageCount }} message{{ messageCount > 1 ? 's' : '' }}
        </Badge>
      </div>

      <!-- Price Overlay -->
      <div class="absolute bottom-3 left-3">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div class="text-xs text-gray-600 font-medium">Prix total</div>
          <div class="text-lg font-bold text-gray-900">
            {{ deal.price }} {{ currencySymbol }}
          </div>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <CardHeader class="pb-3">
      <div class="flex justify-between items-start gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {{ deal.title }}
          </h3>

          <div class="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ deal.location || 'Non spécifié' }}</span>
            </div>

            <span class="text-gray-300">•</span>

            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(deal.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent class="flex-1 pt-0">
      <p class="text-sm text-gray-600 line-clamp-2 mb-4">
        {{ deal.description || 'Aucune description disponible' }}
      </p>

      <!-- Products Summary -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-gray-700">Produits inclus</span>
          <Badge variant="outline" class="text-xs">
            {{ totalProducts }} article{{ totalProducts > 1 ? 's' : '' }}
          </Badge>
        </div>

        <div class="space-y-2 max-h-24 overflow-y-auto">
          <div v-for="product in deal.products?.slice(0, 3)" :key="product.id"
            class="flex justify-between items-center text-sm">
            <span class="text-gray-600 truncate flex-1 mr-2">
              {{ product.quantity }}x {{ product.name }}
            </span>
          </div>

          <div v-if="deal.products && deal.products.length > 3" class="text-xs text-gray-500 italic">
            +{{ deal.products.length - 3 }} autre{{ deal.products.length - 3 > 1 ? 's' : '' }} produit{{
              deal.products.length - 3 > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter class="pt-4 border-t bg-gray-50/50">
      <div class="flex gap-2 w-full">
        <Button variant="outline" size="sm" class="flex-1" as="a" :href="`/deals/${deal.id}`">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Voir
        </Button>

        <Button size="sm" class="flex-1" as="a" :href="`/deals/${deal.id}/edit`">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifier
        </Button>

        <Button v-if="deal.discussions && deal.discussions.length > 0" variant="outline" size="sm" as="a"
          :href="'/chat'" class="relative">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>

          <div v-if="messageCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ messageCount > 9 ? '9+' : messageCount }}
          </div>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
