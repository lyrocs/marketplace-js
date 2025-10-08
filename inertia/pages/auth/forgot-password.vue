<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

// State
const email = ref('')
const isSubmitting = ref(false)

// Methods
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    router.post('/forgot-password', {
      email: email.value
    }, {
      preserveScroll: true,
      onFinish: () => {
        isSubmitting.value = false
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mot de passe oublié
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting || !email"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isSubmitting" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
          </button>
        </div>

        <!-- Links -->
        <div class="text-center">
          <router-link
            to="/auth/login"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            ← Retour à la connexion
          </router-link>
        </div>
      </form>

      <!-- Info -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Information
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>Si votre adresse email existe dans notre système, vous recevrez un lien de réinitialisation dans quelques minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
