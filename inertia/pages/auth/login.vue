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

<style scoped>
.login-button {
  @apply flex w-full justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600;
}
</style>

<template>
    <div class="flex flex-col items-center justify-center">
        <AuthHeader
            title="Ravi de vous revoir"
            subtitle="Connectez-vous pour accéder à votre espace."
        />

        <ErrorAlert :errors="form.errors" />

        <div class="mt-10 w-full sm:mx-auto sm:max-w-md">
            <div class="rounded-xl bg-white p-8 shadow-lg">
                <form @submit.prevent="form.post('/auth/login')" class="space-y-6">
                    <FormInput
                        id="email"
                        v-model="form.email"
                        label="Adresse e-mail"
                        type="email"
                        autocomplete="email"
                        :error="form.errors.email"
                    />

                    <FormInput
                        id="password"
                        v-model="form.password"
                        label="Mot de passe"
                        type="password"
                        autocomplete="current-password"
                        :error="form.errors.password"
                        :required="true"
                        :helper-link="{ text: 'Mot de passe oublié ?', href: '#' }"
                    />

                    <div>
                        <button type="submit" class="login-button">
                            Se connecter
                        </button>
                    </div>
                </form>

                <div class="mt-8">
                    <Divider text="Ou continuez avec" />
                </div>

                <div class="mt-6">
                    <SocialLoginButtons
                        :providers="[
                            { name: 'Google', href: '/google/redirect', icon: 'google' },
                            { name: 'Facebook', href: '#', icon: 'facebook' }
                        ]"
                    />
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