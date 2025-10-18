<script setup lang="ts">
interface Props {
  id: string
  label: string
  type?: string
  modelValue: string
  error?: string
  autocomplete?: string
  required?: boolean
  helperLink?: {
    text: string
    href: string
  }
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">{{ label }}</label>
      <div v-if="helperLink" class="text-sm">
        <a :href="helperLink.href" class="font-semibold text-slate-600 hover:text-slate-500">{{
          helperLink.text
        }}</a>
      </div>
    </div>
    <div class="mt-2">
      <Input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :autocomplete="autocomplete"
        :required="required"
        class="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        :class="error ? 'ring-red-500' : 'ring-gray-300'"
      />
    </div>
  </div>
</template>
