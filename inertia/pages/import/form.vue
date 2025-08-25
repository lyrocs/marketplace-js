<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

// File and data state
const fileInput = ref<HTMLInputElement | null>(null)
const products = ref<any[]>([])
const error = ref<string | null>(null)
const form = useForm({ products: [] })

const props = defineProps<{
    total: number,
    success: number,
}>()

// Handle file selection and JSON parsing
function handleFileChange(event: Event) {
    error.value = null
    const target = event.target as HTMLInputElement
    const file = target.files && target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string)
            if (!Array.isArray(json)) throw new Error('Le fichier doit contenir un tableau de produits.')
            products.value = json
            form.products = json
        } catch (e: any) {
            error.value = 'Fichier JSON invalide : ' + (e.message || e)
            products.value = []
            form.products = []
        }
    }
    reader.readAsText(file)
}

function triggerFileInput() {
    fileInput.value?.click()
}

function submit() {
    form.post('/import', {
        onError: (errs) => {
            error.value = 'Erreur lors de l\'envoi : ' + JSON.stringify(errs)
        },
        onSuccess: () => {
            products.value = []
            form.products = []
            error.value = null
        }
    })
}
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 px-4">
        <div v-if="props.total" class="mb-6 flex flex-col items-center">
            <p class="text-center text-green-600 text-lg font-bold">{{ props.success }} / {{ props.total }} produits
                importés</p>
        </div>
        <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Importer des produits
            </h2>
            <p class="mt-1 text-center text-gray-600">
                Sélectionnez un fichier <span class="font-semibold">.json</span> contenant une liste de produits à
                importer.
            </p>
        </div>

        <div class="mt-8 w-full max-w-2xl">
            <div class="rounded-xl bg-white p-8 shadow-lg">
                <div class="mb-6 flex flex-col items-center">
                    <input ref="fileInput" type="file" accept="application/json" class="hidden"
                        @change="handleFileChange" />
                    <button type="button" @click="triggerFileInput"
                        class="flex items-center gap-2 rounded-md bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Sélectionner un fichier JSON
                    </button>
                    <span v-if="products.length" class="mt-2 text-green-600 text-sm">{{ products.length }} produit(s)
                        chargé(s)</span>
                </div>
                <div v-if="error" class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ error }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="products.length" class="overflow-x-auto rounded-lg border border-gray-200 mb-6">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th v-for="(val, key) in products[0]" :key="key"
                                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    {{ key }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(product, idx) in products" :key="idx">
                                <td v-for="(val, key) in product" :key="key"
                                    class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                    {{ val }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button v-if="products.length" @click="submit"
                    class="mt-4 flex w-full justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
                    Importer ces produits
                </button>
            </div>
        </div>
    </div>
</template>