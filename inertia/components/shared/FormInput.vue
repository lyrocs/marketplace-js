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
    <div class="form-input-header">
      <label :for="id" class="form-input-label">{{ label }}</label>
      <div v-if="helperLink" class="form-input-helper">
        <a :href="helperLink.href" class="form-input-helper-link">{{ helperLink.text }}</a>
      </div>
    </div>
    <div class="mt-2">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :autocomplete="autocomplete"
        :required="required"
        class="form-input"
        :class="error ? 'form-input-error' : 'form-input-default'"
      />
    </div>
  </div>
</template>

<style scoped>
.form-input-header {
  @apply flex items-center justify-between;
}

.form-input-label {
  @apply block text-sm font-medium leading-6 text-gray-900;
}

.form-input-helper {
  @apply text-sm;
}

.form-input-helper-link {
  @apply font-semibold text-slate-600 hover:text-slate-500;
}

.form-input {
  @apply block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6;
}

.form-input-error {
  @apply ring-red-500;
}

.form-input-default {
  @apply ring-gray-300;
}
</style>
