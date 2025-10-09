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
    name: z.string({ message: t('auth.error.nameRequired') }).min(2, { message: t('auth.error.nameRequired') }).max(250),
    email: z.string({ message: t('auth.error.emailRequired') }).min(2, { message: t('auth.error.emailRequired') }).max(250),
    password: z.string({ message: t('auth.error.passwordRequired') }).min(8, { message: t('auth.error.passwordRequired') }).max(250),
}))

const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
    router.post('/auth/register', values)
})
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <AuthHeader :title="$t('auth.registerTitle')" :subtitle="$t('auth.registerSubtitle')" />
        <ErrorAlert :errors="errors" />
        <div class="mt-4 w-full sm:mx-auto sm:max-w-md">
            <div class="rounded-xl bg-white p-8 shadow-lg">
                <form @submit="onSubmit" class="space-y-6">
                    <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>{{ $t('auth.name') }}</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>
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
                    <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
                        <FormItem>
                            <FormLabel>{{ $t('auth.password') }}</FormLabel>
                            <FormControl>
                                <Input type="password" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <Button type="submit" size="lg" class="w-full">
                        {{ $t('auth.register') }}
                    </Button>
                </form>
                <p class="mt-10 text-center text-sm">
                    {{ $t('auth.alreadyHaveAccount') }}
                    <a href="/auth/login" class="font-semibold leading-6 hover:text-slate-500">
                        {{ $t('auth.login') }}
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>