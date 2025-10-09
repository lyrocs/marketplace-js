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
  messages?: any
}>()


const formSchema = toTypedSchema(z.object({
  email: z.string({ message: t('auth.error.emailRequired') }).min(2, { message: t('auth.error.emailRequired') }).max(250),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  router.post('/auth/forgot-password', values)
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <AuthHeader :title="$t('auth.forgotPasswordTitle')" :subtitle="$t('auth.forgotPasswordSubtitle')" />
    <ErrorAlert :errors="errors" />
    <div class="mt-4 w-full sm:mx-auto sm:max-w-md">
      <div class="card">
        <form v-if="!messages?.success" @submit="onSubmit" class="space-y-6">
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
          <InfoCard :title="$t('auth.forgotInfoTitle')" :description="$t('auth.forgotInfoDescription')" />
          <Button type="submit" size="lg" class="w-full">
            {{ $t('auth.sendResetEmail') }}
          </Button>
        </form>
        <InfoCard v-else :title="$t('auth.emailSent')" />
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
