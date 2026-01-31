<script setup lang="ts">
import { Button } from '~/components/ui/button'
import DealDto from '#dtos/deal'

defineProps<{
  deals: DealDto[]
}>()
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Deals Grid -->
      <div v-if="deals.length > 0" class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <MyDealCard v-for="deal in deals" :key="deal.id" :deal="deal" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        title="Aucune annonce"
        message="Vous n'avez pas encore créé d'annonce. Commencez dès maintenant !"
      >
        <template #actions>
          <Button as="a" href="/deals/create" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer ma première annonce
          </Button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
