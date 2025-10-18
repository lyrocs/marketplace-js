<script setup lang="ts">
interface Props {
  modelValue: number
  min?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const decrease = () => {
  emit('update:modelValue', Math.max(props.min, props.modelValue - 1))
}

const increase = () => {
  emit('update:modelValue', props.modelValue + 1)
}

const handleInput = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value, 10)
  emit('update:modelValue', Math.max(props.min, isNaN(value) ? props.min : value))
}
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      @click="decrease"
      class="px-2 py-1 border hover:bg-gray-100 rounded-l-md"
      :disabled="modelValue <= min"
    >
      -
    </button>
    <input
      type="number"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      class="w-16 text-center border-t border-b border-gray-300 py-1"
    />
    <button type="button" @click="increase" class="px-2 py-1 border hover:bg-gray-100 rounded-r-md">
      +
    </button>
  </div>
</template>
