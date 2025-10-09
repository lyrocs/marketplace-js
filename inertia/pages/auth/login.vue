<script setup lang="ts">
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form'
import { defineOptions } from 'vue'
import { useForm } from "vee-validate"
import AuthLayout from '~/layouts/AuthLayout.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from "zod";
import { router } from '@inertiajs/vue3'

defineOptions({
    layout: AuthLayout
})

defineProps<{
    errors?: Record<string, string>
}>()

const formSchema = toTypedSchema(z.object({
    email: z.string({ message: 'Le champ email est requis' }).min(2, { message: 'Le champ email est requis' }).max(250),
    password: z.string({ message: 'Le champ mot de passe est requis' }).min(8, { message: 'Le champ mot de passe est requis' }).max(250),
}))

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
    router.post('/auth/login', values)
})

</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <AuthHeader title="Ravi de vous (re)voir" subtitle="Connectez-vous pour accéder à votre espace." />
        <ErrorAlert :errors="errors" />
        <div class="w-full mt-4 sm:mx-auto sm:max-w-md">
            <div class="card">
                <form class="space-y-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>Adresse e-mail</FormLabel>
                            <FormControl>
                                <Input type="email" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem>
                            <FormLabel class="flex justify-between">
                                <div>Mot de passe</div>
                                <a href="/forgot-password" class="text-secondary">Mot de
                                    passe
                                    oublié ?</a>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <Button type="submit" size="lg" class="w-full">
                        Se connecter
                    </Button>
                </form>

                <div class="mt-6">
                    <Divider text="Ou continuez avec" />
                </div>

                <div class="mt-6">
                    <SocialLoginButtons :providers="[
                        { name: 'Google', href: '/google/redirect', icon: 'google' },
                        { name: 'Facebook', href: '#', icon: 'facebook' }
                    ]" />
                </div>
            </div>

            <p class="mt-6 text-center text-sm text-primary">
                Pas encore de compte ?
                <a href="/auth/register" class="font-semibold leading-6 hover:text-slate-500">Inscrivez-vous
                    gratuitement</a>
            </p>
        </div>
    </div>
</template>