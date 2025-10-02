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

<style scoped>
.register-button {
  @apply flex w-full justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50;
}
</style>

<template>
    <div class="flex flex-col items-center justify-center">
        <AuthHeader
            title="Créer un compte"
            subtitle="Créez votre compte pour commencer"
        />

        <ErrorAlert :errors="form.errors" />

        <div class="mt-10 w-full sm:mx-auto sm:max-w-md">
            <div class="rounded-xl bg-white p-8 shadow-lg">
                <form @submit.prevent="form.post('/auth/register')" class="space-y-6">
                    <FormInput
                        id="name"
                        v-model="form.name"
                        label="Nom complet"
                        type="text"
                        autocomplete="name"
                        :error="form.errors.name"
                        :required="true"
                    />

                    <FormInput
                        id="email"
                        v-model="form.email"
                        label="Adresse e-mail"
                        type="email"
                        autocomplete="email"
                        :error="form.errors.email"
                        :required="true"
                    />

                    <FormInput
                        id="password"
                        v-model="form.password"
                        label="Mot de passe"
                        type="password"
                        autocomplete="new-password"
                        :error="form.errors.password"
                        :required="true"
                    />

                    <div>
                        <button type="submit" :disabled="form.processing" class="register-button">
                            <span v-if="form.processing">Création du compte...</span>
                            <span v-else>Créer un compte</span>
                        </button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm text-gray-500">
                    Déjà un compte ?
                    <a href="/auth/login" class="font-semibold leading-6 text-slate-600 hover:text-slate-500">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>