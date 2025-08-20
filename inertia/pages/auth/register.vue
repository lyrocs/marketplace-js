<script setup lang="ts">
import { defineOptions } from 'vue'
import { useForm } from '@inertiajs/vue3'
import AuthLayout from '~/layouts/AuthLayout.vue'

defineOptions({
    layout: AuthLayout
})

defineProps<{
    errors?: Record<string, string>
}>()

const form = useForm({
    name: '',
    email: '',
    password: '',
})
</script>

<template>
    <div class=" flex min-h-screen flex-col items-center justify-center">

        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <a href="#" class="block text-center text-3xl font-bold text-gray-800">
                Marketplace<span class="text-slate-600">.js</span>
            </a>

            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Créer un compte</h2>
            <p class="mt-1 text-center text-gray-600">Créez votre compte pour commencer</p>
        </div>

        <div v-if="form.errors" class="mt-4 w-full max-w-md mx-auto">
            <div v-for="(error, index) in form.errors" :key="index"
                class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
                        <p class="text-sm text-red-700">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-10 w-full sm:mx-auto sm:max-w-md">
            <div class="rounded-xl bg-white p-8 shadow-lg">
                <form @submit.prevent="form.post('/auth/register')" class="space-y-6">
                    <!-- Full Name -->
                    <div>
                        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nom
                            complet</label>
                        <div class="mt-2">
                            <input v-model="form.name" id="name" name="name" type="text" autocomplete="name" required
                                :class="{
                                    'ring-red-500': form.errors.name,
                                    'ring-gray-300': !form.errors.name
                                }"
                                class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                            <p v-if="form.errors.name" class="mt-2 text-sm text-red-600">{{ form.errors.name }}
                            </p>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse
                            e-mail</label>
                        <div class="mt-2">
                            <input v-model="form.email" id="email" name="email" type="email" autocomplete="email"
                                required :class="{
                                    'ring-red-500': form.errors.email,
                                    'ring-gray-300': !form.errors.email
                                }"
                                class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                            <p v-if="form.errors.email" class="mt-2 text-sm text-red-600">{{ form.errors.email }}</p>
                        </div>
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de
                            passe</label>
                        <div class="mt-2">
                            <input v-model="form.password" id="password" name="password" type="password"
                                autocomplete="new-password" required :class="{
                                    'ring-red-500': form.errors.password,
                                    'ring-gray-300': !form.errors.password
                                }"
                                class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                            <p v-if="form.errors.password" class="mt-2 text-sm text-red-600">{{ form.errors.password }}
                            </p>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit" :disabled="form.processing"
                            class="flex w-full justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50">
                            <span v-if="form.processing">Création du compte...</span>
                            <span v-else>Créer un compte</span>
                        </button>
                    </div>
                </form>

                <!-- Login Link -->
                <p class="mt-10 text-center text-sm text-gray-500">
                    Déjà un compte ?
                    <a href="/auth/login" class="font-semibold leading-6 text-slate-600 hover:text-slate-500">Se
                        connecter</a>
                </p>
            </div>
        </div>
    </div>
</template>