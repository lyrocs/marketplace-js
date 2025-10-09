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

const props = defineProps<{
  errors?: Record<string, string>
  messages?: any
  token?: string
  invalidToken?: boolean
}>()

const formSchema = toTypedSchema(z.object({
  password: z.string({ message: t('auth.error.passwordRequired') }).min(8, { message: t('auth.error.passwordRequired') }).max(250),
  password_confirmation: z.string({ message: t('auth.error.passwordRequired') }).min(8, { message: t('auth.error.passwordRequired') }).max(250),
}).refine((data) => data.password === data.password_confirmation, {
    message: t('auth.error.passwordConfirmation'),
    path: ['password_confirmation']
  }))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  router.post('/auth/reset-password', { ...values, token: props.token })
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <AuthHeader :title="$t('auth.resetPasswordTitle')" :subtitle="$t('auth.resetPasswordSubtitle')" />
    <ErrorAlert :errors="errors" />
    <div class="mt-4 w-full sm:mx-auto sm:max-w-md">
      <div class="card">
        <InfoCard v-if="invalidToken" :title="$t('auth.invalidTokenTitle')" :description="$t('auth.invalidTokenDescription')" type="error" />
        <form v-else @submit="onSubmit" class="space-y-6">
          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>{{ $t('auth.newPassword') }}</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>{{ $t('auth.passwordConfirmation') }}</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
          <InfoCard :title="$t('auth.forgotInfoTitle')" :description="$t('auth.forgotInfoDescription')" />
          <Button type="submit" size="lg" class="w-full">
            {{ $t('auth.resetPassword') }}
          </Button>
        </form>
      </div>
    </div>
    <p class="mt-6 text-center text-sm">
      {{ $t('auth.passwordFound') }}
      <a href="/auth/login" class="font-semibold leading-6 hover:text-slate-500">
        {{ $t('auth.login') }}
      </a>
    </p>
  </div>
</template>
