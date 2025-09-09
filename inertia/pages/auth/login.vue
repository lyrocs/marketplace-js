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
    email: '',
    password: '',
    remember: false,
})
</script>

<template>
    <div class="flex flex-col items-center justify-center">

        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <a href="#" class="block text-center text-3xl font-bold text-gray-800">
                Marketplace<span class="text-slate-600">.js</span>
            </a>

            <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Ravi de vous revoir
            </h2>
            <p class="mt-1 text-center text-gray-600">Connectez-vous pour accéder à votre espace.</p>
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
                <form @submit.prevent="form.post('/auth/login')" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse
                            e-mail</label>
                        <div class="mt-2">
                            <input v-model="form.email" id="email" name="email" type="email" autocomplete="email"
                                :class="{
                                    'ring-red-500': form.errors.email,
                                    'ring-gray-300': !form.errors.email
                                }"
                                class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de
                                passe</label>
                            <div class="text-sm">
                                <a href="#" class="font-semibold text-slate-600 hover:text-slate-500">Mot de passe
                                    oublié ?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input v-model="form.password" id="password" name="password" type="password"
                                autocomplete="current-password" required :class="{
                                    'ring-red-500': form.errors.password,
                                    'ring-gray-300': !form.errors.password
                                }"
                                class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="flex w-full justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">Se
                            connecter</button>
                    </div>
                </form>

                <div class="mt-8">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center" aria-hidden="true">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="bg-white px-2 text-gray-500">Ou continuez avec</span>
                        </div>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-4">
                    <a href="/google/redirect"
                        class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-slate-600">
                        <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 4.75C13.7703 4.75 15.2503 5.375 16.3603 6.415L19.6003 3.175C17.6003 1.45 15.0303 0.5 12.0003 0.5C7.3003 0.5 3.4203 3.325 1.8303 7.15L5.4203 9.765C6.2203 6.9 8.8203 4.75 12.0003 4.75Z"
                                fill="#EA4335"></path>
                            <path
                                d="M23.5 12.25C23.5 11.56 23.44 10.895 23.315 10.25H12.0003V14.45H18.5203C18.2353 16.065 17.3103 17.425 15.9003 18.335L19.5803 20.945C21.9303 18.845 23.5 15.825 23.5 12.25Z"
                                fill="#4285F4"></path>
                            <path
                                d="M5.42029 9.765C5.16529 9.075 5.01529 8.32 5.01529 7.5C5.01529 6.68 5.16529 5.925 5.42029 5.235L1.83029 1.845C0.66529 3.995 0.000294434 6.175 0.000294434 8.5C0.000294434 10.825 0.66529 13.005 1.83029 15.155L5.42029 12.545C5.16529 11.855 5.01529 11.095 5.01529 10.3C5.01529 9.505 5.16529 8.75 5.42029 9.765Z"
                                fill="#FBBC05" transform="translate(0 -0.81)"></path>
                            <path
                                d="M12.0003 24C15.0303 24 17.6003 23.055 19.5803 21.36L15.9003 18.745C14.8603 19.515 13.5303 19.95 12.0003 19.95C8.8203 19.95 6.2203 17.9 5.4203 15.145L1.8303 18.545C3.4203 22.37 7.3003 24 12.0003 24Z"
                                fill="#34A853"></path>
                        </svg>
                        <span>Google</span>
                    </a>

                    <a href="#"
                        class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-slate-600">
                        <svg class="size-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988H8.05V12h2.388V9.785c0-2.358 1.41-3.655 3.54-3.655 1.012 0 2.067.18 2.067.18v2.51h-1.229c-1.15 0-1.52.723-1.52 1.464V12h2.828l-.455 2.891h-2.373v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10Z">
                            </path>
                        </svg>
                        <span>Facebook</span>
                    </a>
                </div>

            </div>

            <p class="mt-10 text-center text-sm text-gray-500">
                Pas encore de compte ?
                <a href="/auth/register"
                    class="font-semibold leading-6 text-slate-600 hover:text-slate-500">Inscrivez-vous
                    gratuitement</a>
            </p>
        </div>
    </div>
</template>