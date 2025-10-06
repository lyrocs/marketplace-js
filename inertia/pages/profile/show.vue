<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import UserDto from '#dtos/user'
import { toast } from 'vue-sonner'

// Props
const props = defineProps<{
  user: UserDto
  csrfToken?: string
}>()

// State
const isEditing = ref(false)
const isUploading = ref(false)
const isSubmitting = ref(false)

// Form data
const form = ref({
  name: props.user.name || '',
  email: props.user.email,
})

// Computed
const avatarUrl = computed(() => {
  return props.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name || 'User')}&background=6366f1&color=fff&size=128`
})

// Methods
const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  form.value = {
    name: props.user.name || '',
    email: props.user.email,
  }
}

const submitProfile = async () => {
  isSubmitting.value = true
  
  try {
    router.put('/profile', form.value, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Profil mis à jour avec succès')
        isEditing.value = false
      },
      onError: (errors) => {
        console.error('Erreurs:', errors)
        toast.error('Erreur lors de la mise à jour du profil')
      }
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validation côté client
  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (file.size > maxSize) {
    toast.error('L\'image doit faire moins de 2MB')
    return
  }
  
  if (!allowedTypes.includes(file.type)) {
    toast.error('Format d\'image non supporté (JPG, PNG, WebP uniquement)')
    return
  }
  
  isUploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/profile/image', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': props.csrfToken || '',
        'Accept': 'application/json',
      },
      body: formData,
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      toast.success('Image de profil mise à jour')
      // Recharger la page pour afficher la nouvelle image
      router.reload({ only: ['user'] })
    } else {
      toast.error(result.message || 'Erreur lors de l\'upload de l\'image')
    }
  } catch (error) {
    console.error('Erreur upload:', error)
    toast.error('Erreur lors de l\'upload de l\'image')
  } finally {
    isUploading.value = false
    // Reset input
    target.value = ''
  }
}

const removeImage = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre image de profil ?')) {
    return
  }
  
  try {
    const response = await fetch('/profile/image', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': props.csrfToken || '',
        'Accept': 'application/json',
      },
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      toast.success('Image de profil supprimée')
      router.reload({ only: ['user'] })
    } else {
      toast.error(result.message || 'Erreur lors de la suppression')
    }
  } catch (error) {
    console.error('Erreur suppression:', error)
    toast.error('Erreur lors de la suppression')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-8">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <a
              href="/" 
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Retour à l'accueil
            </a>
          </div>

          <!-- Avatar Section -->
          <div class="flex items-center space-x-6 mb-8">
            <div class="relative">
              <img 
                :src="avatarUrl" 
                :alt="user.name || 'Avatar'"
                class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div class="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center group">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  :disabled="isUploading"
                />
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900">{{ user.name || 'Utilisateur' }}</h2>
              <p class="text-gray-600">{{ user.email }}</p>
              <div class="mt-2">
                <button
                  @click="handleImageUpload"
                  :disabled="isUploading"
                  class="text-sm text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50"
                >
                  {{ isUploading ? 'Upload en cours...' : 'Changer la photo' }}
                </button>
                <span class="text-gray-300 mx-2">•</span>
                <button
                  @click="removeImage"
                  class="text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Profile Information Form -->
          <div class="border-t pt-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
              <button
                v-if="!isEditing"
                @click="startEdit"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Modifier
              </button>
            </div>

            <form v-if="isEditing" @submit.prevent="submitProfile" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="votre@email.com"
                />
              </div>

              <div class="flex space-x-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  :disabled="isSubmitting"
                  class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>

            <!-- Display Mode -->
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <p class="text-gray-900">{{ user.name || 'Non renseigné' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <p class="text-gray-900">{{ user.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Membre depuis</label>
                <p class="text-gray-900">{{ new Date(user.createdAt).toLocaleDateString('fr-FR') }}</p>
              </div>
              <div v-if="user.isAdmin">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Administrateur
                </span>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="border-t pt-8 mt-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium">ID Utilisateur:</span>
                <span class="ml-2 font-mono text-xs">{{ user.id }}</span>
              </div>
              <div>
                <span class="font-medium">Matrix Login:</span>
                <span class="ml-2">{{ user.matrixLogin || 'Non configuré' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
