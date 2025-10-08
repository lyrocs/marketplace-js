<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

// Props
const props = defineProps<{
  token?: string
  user?: {
    name?: string
    email: string
  }
  error?: string
  invalidToken?: boolean
}>()

// State
const form = ref({
  password: '',
  password_confirmation: ''
})
const isSubmitting = ref(false)

// Methods
const submitForm = async () => {
  if (!props.token) return
  
  isSubmitting.value = true
  
  try {
    router.post('/reset-password', {
      token: props.token,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    }, {
      preserveScroll: true,
      onFinish: () => {
        isSubmitting.value = false
      }
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    isSubmitting.value = false
  }
}

const isFormValid = () => {
  return form.value.password.length >= 8 && 
         form.value.password === form.value.password_confirmation &&
         form.value.password.length > 0
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Nouveau mot de passe
        </h2>
        <p v-if="!invalidToken && user" class="mt-2 text-center text-sm text-gray-600">
          Bonjour {{ user.name || 'Utilisateur' }}, veuillez définir votre nouveau mot de passe.
        </p>
        <p v-else-if="invalidToken" class="mt-2 text-center text-sm text-red-600">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error && !invalidToken" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erreur
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invalid Token Message -->
      <div v-if="invalidToken" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Lien invalide
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form (only show if token is valid) -->
      <form v-if="!invalidToken" class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minimum 8 caractères"
            />
            <p v-if="form.password.length > 0 && form.password.length < 8" class="mt-1 text-sm text-red-600">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Répétez le mot de passe"
            />
            <p v-if="form.password_confirmation.length > 0 && form.password !== form.password_confirmation" class="mt-1 text-sm text-red-600">
              Les mots de passe ne correspondent pas.
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid()"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isSubmitting" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
          </button>
        </div>
      </form>

      <!-- Links -->
      <div class="text-center">
        <a
          href="/forgot-password"
          class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Demander un nouveau lien
        </a>
        <span class="mx-2 text-gray-300">•</span>
        <a
          href="/auth/login"
          class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Retour à la connexion
        </a>
      </div>

      <!-- Password Requirements -->
      <div v-if="!invalidToken" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Exigences du mot de passe
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>Minimum 8 caractères</li>
                <li>Utilisez des lettres, chiffres et symboles pour plus de sécurité</li>
                <li>Évitez les mots de passe simples ou courants</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
