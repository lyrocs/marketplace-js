<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import MyDealCard from '~/components/MyDealCard.vue'
import DealDto from '#dtos/deal'

const props = defineProps<{
  deals: DealDto[]
}>()

// State for filtering and sorting
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')

// Computed properties for filtering and sorting
const filteredDeals = computed(() => {
  let filtered = [...props.deals]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(deal => 
      deal.title?.toLowerCase().includes(query) ||
      deal.description?.toLowerCase().includes(query) ||
      deal.location?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(deal => 
      deal.status?.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  // Sorting
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'price-high':
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'price-low':
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'title':
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
  }

  return filtered
})

// Statistics
const dealStats = computed(() => {
  const total = props.deals.length
  const active = props.deals.filter(d => d.status?.toLowerCase() === 'active').length
  const pending = props.deals.filter(d => d.status?.toLowerCase() === 'pending').length
  const completed = props.deals.filter(d => ['sold', 'completed'].includes(d.status?.toLowerCase() || '')).length
  const totalValue = props.deals.reduce((sum, deal) => {
    const price = typeof deal.price === 'string' ? parseFloat(deal.price) : (deal.price || 0)
    return sum + (isNaN(price) ? 0 : price)
  }, 0)

  return { total, active, pending, completed, totalValue }
})

// Unique statuses for filter dropdown
const availableStatuses = computed(() => {
  const statuses = [...new Set(props.deals.map(deal => deal.status).filter(Boolean))]
  return statuses.map(status => ({
    value: status.toLowerCase(),
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }))
})

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  sortBy.value = 'newest'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Mes Annonces</h1>
              <p class="mt-2 text-sm text-gray-600">
                Gérez et suivez toutes vos annonces en un seul endroit
              </p>
            </div>
            
            <div class="flex items-center gap-3">
              <Button as="a" href="/deals/create" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle annonce
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ dealStats.total }}</p>
            </div>
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Actives</p>
              <p class="text-2xl font-bold text-green-600">{{ dealStats.active }}</p>
            </div>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-yellow-600">{{ dealStats.pending }}</p>
            </div>
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Vendues</p>
              <p class="text-2xl font-bold text-blue-600">{{ dealStats.completed }}</p>
            </div>
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Valeur totale</p>
              <p class="text-2xl font-bold text-gray-900">{{ Math.round(dealStats.totalValue).toLocaleString('fr-FR') }}€</p>
            </div>
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Controls -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <!-- Search -->
            <div class="flex-1 max-w-md">
              <Input
                v-model="searchQuery"
                placeholder="Rechercher par titre, description ou lieu..."
                class="w-full"
              >
                <template #prefix>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </Input>
            </div>
            
            <!-- Status Filter -->
            <Select v-model="statusFilter">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem 
                  v-for="status in availableStatuses" 
                  :key="status.value" 
                  :value="status.value"
                >
                  {{ status.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            
            <!-- Sort -->
            <Select v-model="sortBy">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="oldest">Plus ancien</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="title">Titre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Clear Filters -->
            <Button 
              v-if="searchQuery || statusFilter !== 'all' || sortBy !== 'newest'"
              variant="outline" 
              size="sm"
              @click="clearFilters"
            >
              Effacer les filtres
            </Button>
            
            <!-- View Mode Toggle -->
            <div class="flex items-center border border-gray-200 rounded-lg p-1">
              <button
                :class="[
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
                @click="viewMode = 'grid'"
                title="Vue grille"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                :class="[
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
                @click="viewMode = 'list'"
                title="Vue liste"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Active Filters Display -->
        <div v-if="searchQuery || statusFilter !== 'all'" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span class="text-sm text-gray-600">Filtres actifs:</span>
          
          <Badge v-if="searchQuery" variant="secondary" class="flex items-center gap-1">
            Recherche: "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="ml-1 hover:text-red-600">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
          
          <Badge v-if="statusFilter !== 'all'" variant="secondary" class="flex items-center gap-1">
            Statut: {{ availableStatuses.find(s => s.value === statusFilter)?.label }}
            <button @click="statusFilter = 'all'" class="ml-1 hover:text-red-600">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
        </div>
      </div>

      <!-- Results Count -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-gray-600">
          {{ filteredDeals.length }} annonce{{ filteredDeals.length > 1 ? 's' : '' }} 
          {{ filteredDeals.length !== props.deals.length ? `sur ${props.deals.length}` : '' }}
        </p>
      </div>

      <!-- Deals Grid/List -->
      <div 
        v-if="filteredDeals.length > 0"
        :class="[
          'grid gap-6',
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' 
            : 'grid-cols-1'
        ]"
      >
        <MyDealCard 
          v-for="deal in filteredDeals" 
          :key="deal.id" 
          :deal="deal" 
        />
      </div>

      <!-- Empty State -->
      <div 
        v-else 
        class="text-center py-16"
      >
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ props.deals.length === 0 ? 'Aucune annonce' : 'Aucun résultat' }}
          </h3>
          
          <p class="text-gray-600 mb-6">
            {{ props.deals.length === 0 
              ? 'Vous n\'avez pas encore créé d\'annonce. Commencez dès maintenant !' 
              : 'Aucune annonce ne correspond à vos critères de recherche.' 
            }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              v-if="props.deals.length === 0"
              as="a"
              href="/deals/create" 
              class="flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Créer ma première annonce
            </Button>
            
            <Button 
              v-else
              variant="outline" 
              @click="clearFilters"
            >
              Effacer les filtres
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
