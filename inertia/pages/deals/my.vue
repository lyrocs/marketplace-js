<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
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
    <PageHeader title="Mes Annonces" subtitle="Gérez et suivez toutes vos annonces en un seul endroit">
      <template #actions>
        <Button as="a" href="/deals/create" class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle annonce
        </Button>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Total" :value="dealStats.total" icon-color="blue">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </StatsCard>

        <StatsCard label="Actives" :value="dealStats.active" icon-color="green" value-color="text-green-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </StatsCard>

        <StatsCard label="En attente" :value="dealStats.pending" icon-color="yellow" value-color="text-yellow-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </StatsCard>

        <StatsCard label="Vendues" :value="dealStats.completed" icon-color="blue" value-color="text-blue-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </StatsCard>

        <StatsCard label="Valeur totale" :value="`${Math.round(dealStats.totalValue).toLocaleString('fr-FR')}€`"
          icon-color="gray">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </StatsCard>
      </div>

      <!-- Filters and Controls -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <!-- Search -->
            <div class="flex-1 max-w-md">
              <Input v-model="searchQuery" placeholder="Rechercher par titre, description ou lieu..." class="w-full">
              <template #prefix>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <SelectItem v-for="status in availableStatuses" :key="status.value" :value="status.value">
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
            <Button v-if="searchQuery || statusFilter !== 'all' || sortBy !== 'newest'" variant="outline" size="sm"
              @click="clearFilters">
              Effacer les filtres
            </Button>

            <!-- View Mode Toggle -->
            <ViewModeToggle v-model="viewMode" />
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="searchQuery || statusFilter !== 'all'"
          class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
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
            Statut: {{availableStatuses.find(s => s.value === statusFilter)?.label}}
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
      <div v-if="filteredDeals.length > 0" :class="[
        'grid gap-6',
        viewMode === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
          : 'grid-cols-1'
      ]">
        <MyDealCard v-for="deal in filteredDeals" :key="deal.id" :deal="deal" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        :title="props.deals.length === 0 ? 'Aucune annonce' : 'Aucun résultat'"
        :message="
          props.deals.length === 0
            ? 'Vous n\'avez pas encore créé d\'annonce. Commencez dès maintenant !'
            : 'Aucune annonce ne correspond à vos critères de recherche.'
        "
      >
        <template #actions>
          <Button v-if="props.deals.length === 0" as="a" href="/deals/create" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer ma première annonce
          </Button>

          <Button v-else variant="outline" @click="clearFilters">
            Effacer les filtres
          </Button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
