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
import { useTranslation } from "i18next-vue";
const { t } = useTranslation();

defineOptions({
    layout: AuthLayout
})

defineProps<{
    errors?: Record<string, string>
}>()

const formSchema = toTypedSchema(z.object({
    email: z.string({ message: t('auth.error.emailRequired') }).min(2, { message: t('auth.error.emailRequired') }).max(250),
    password: z.string({ message: t('auth.error.passwordRequired') }).min(8, { message: t('auth.error.passwordRequired') }).max(250),
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
        <AuthHeader :title="$t('auth.welcome')" :subtitle="$t('auth.subtitle')" />
        <ErrorAlert :errors="errors" />
        <div class="w-full mt-4 sm:mx-auto sm:max-w-md">
            <div class="card">
                <form class="space-y-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>{{ $t('auth.email') }}</FormLabel>
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
                                <div>{{ $t('auth.password') }}</div>
                                <a href="/forgot-password" class="text-secondary">{{ $t('auth.forgotPassword') }}</a>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <Button type="submit" size="lg" class="w-full">
                        {{ $t('auth.login') }}
                    </Button>
                </form>

                <div class="mt-6">
                    <Divider :text="$t('auth.orContinueWith')" />
                </div>

                <div class="mt-6">
                    <SocialLoginButtons :providers="[
                        { name: $t('auth.google'), href: '/google/redirect', icon: 'google' },
                        { name: $t('auth.facebook'), href: '#', icon: 'facebook' }
                    ]" />
                </div>
            </div>

            <p class="mt-6 text-center text-sm text-primary">
                {{ $t('auth.noAccount') }}
                <a href="/auth/register" class="font-semibold leading-6 hover:text-slate-500">{{
                    $t('auth.registerNow')}}</a>
            </p>
        </div>
    </div>
</template>