<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import UserDto from '#dtos/user'
import DealDto from '#dtos/deal'
import MetaDto from '#dtos/meta'

// Props
const props = defineProps<{
  user: UserDto
  deals: DealDto[]
  meta: MetaDto
  stats: {
    totalDeals: number
    publishedDeals: number
    soldDeals: number
    saleRate: number
    memberSince: string | null
  }
  currentPage: number
}>()

// Computed
const avatarUrl = computed(() => {
  return props.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name || 'User')}&background=6366f1&color=fff&size=128`
})

const memberSince = computed(() => {
  if (!props.stats.memberSince) return 'Récemment'
  return new Date(props.stats.memberSince).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  })
})

const hasDeals = computed(() => props.deals.length > 0)

// Methods
const contactUser = () => {
  // Pour l'instant, rediriger vers la page de contact général
  // Plus tard, on pourra créer un système de contact direct
  router.get('/contact', {
    user: props.user.id
  })
}

const loadMore = () => {
  if (props.meta.currentPage < props.meta.lastPage) {
    router.get(`/user/${props.user.id}`, {
      page: props.currentPage + 1
    }, {
      preserveState: true,
      preserveScroll: true,
      only: ['deals', 'meta', 'currentPage']
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec informations utilisateur -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-6">
          <a href="/" class="text-gray-500 hover:text-gray-700 transition-colors">
            ← Retour à l'accueil
          </a>
        </div>

        <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              :src="avatarUrl" 
              :alt="user.name || 'Avatar'"
              class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <!-- Informations utilisateur -->
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {{ user.name || 'Utilisateur' }}
            </h1>
            <p class="text-gray-600 mb-4">
              Membre depuis {{ memberSince }}
            </p>

            <!-- Statistiques -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-indigo-600">{{ stats.totalDeals }}</div>
                <div class="text-sm text-gray-500">Total annonces</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ stats.publishedDeals }}</div>
                <div class="text-sm text-gray-500">En ligne</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ stats.soldDeals }}</div>
                <div class="text-sm text-gray-500">Vendues</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ stats.saleRate }}%</div>
                <div class="text-sm text-gray-500">Taux de vente</div>
              </div>
            </div>

            <!-- Badge admin si applicable -->
            <div v-if="user.isAdmin" class="mb-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Administrateur
              </span>
            </div>
          </div>

          <!-- Bouton de contact -->
          <div class="flex-shrink-0">
            <button
              @click="contactUser"
              class="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Contacter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Section des annonces -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Annonces en ligne ({{ stats.publishedDeals }})
        </h2>

        <!-- Message si pas d'annonces -->
        <div v-if="!hasDeals" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune annonce</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ user.name }} n'a pas encore publié d'annonces.
          </p>
        </div>

        <!-- Grille des annonces -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DealCard 
            v-for="deal in deals" 
            :key="deal.id"
            :deal="deal"
          />
        </div>

        <!-- Bouton "Voir plus" pour la pagination -->
        <div v-if="meta.currentPage < meta.lastPage" class="text-center mt-8">
          <button
            @click="loadMore"
            class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Voir plus d'annonces
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

