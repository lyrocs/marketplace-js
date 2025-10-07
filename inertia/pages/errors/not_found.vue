<script setup lang="ts">
import { router } from '@inertiajs/vue3'

// Props
const props = defineProps<{
  message?: string
}>()

// Methods
const goHome = () => {
  router.get('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- Icône 404 -->
        <div class="mx-auto h-24 w-24 text-gray-400 mb-6">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.571M15 6.334c.896-.061 1.785-.147 2.677-.249a48.08 48.08 0 00-2.677.249z" />
          </svg>
        </div>

        <!-- Titre -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          {{ props.message || 'Page non trouvée' }}
        </h2>
        
        <!-- Description -->
        <p class="text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <!-- Actions -->
        <div class="space-y-4">
          <button
            @click="goHome"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Retour à l'accueil
          </button>
          
          <button
            @click="window.history.back()"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Page précédente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
