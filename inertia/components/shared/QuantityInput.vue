<script setup lang="ts">
interface Props {
  modelValue: number
  min?: number
}

withDefaults(defineProps<Props>(), {
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

const props = defineProps<Props>()
</script>

<template>
  <div class="quantity-input">
    <button type="button" @click="decrease" class="quantity-button quantity-button-left" :disabled="modelValue <= min">
      -
    </button>
    <input
      type="number"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      class="quantity-value"
    />
    <button type="button" @click="increase" class="quantity-button quantity-button-right">
      +
    </button>
  </div>
</template>

<style scoped>
.quantity-input {
  @apply flex items-center;
}

.quantity-button {
  @apply px-2 py-1 border hover:bg-gray-100;
}

.quantity-button-left {
  @apply rounded-l-md;
}

.quantity-button-right {
  @apply rounded-r-md;
}

.quantity-value {
  @apply w-16 text-center border-t border-b border-gray-300 py-1;
}
</style>
