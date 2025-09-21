<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import type { MessageInputProps } from '~/types/chat'
import { IconSendOutline } from '@iconify-prerendered/vue-material-symbols'

const props = withDefaults(defineProps<MessageInputProps>(), {
  disabled: false,
  placeholder: 'Écrivez votre message...',
})

const emit = defineEmits<{
  send: [message: string]
}>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const isSubmitting = ref(false)

const handleSubmit = async () => {
  const trimmedMessage = message.value.trim()

  if (!trimmedMessage || props.disabled || isSubmitting.value) {
    return
  }

  try {
    isSubmitting.value = true
    emit('send', trimmedMessage)
    message.value = ''

    // Reset textarea height
    await nextTick()
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Send message on Enter (but not Shift+Enter)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement

  // Auto-resize textarea
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 120)}px`
}

const isDisabled = computed(() => props.disabled || isSubmitting.value)
</script>

<template>
  <div class="p-4 border-t bg-white flex-shrink-0">
    <form class="flex items-end gap-3" @submit.prevent="handleSubmit">
      <!-- Message Input -->
      <div class="flex-grow">
        <Textarea ref="textareaRef" v-model="message" :placeholder="placeholder" :disabled="isDisabled" rows="1"
          class="w-full border-gray-300 rounded-2xl shadow-sm focus:border-slate-500 focus:ring-slate-500 resize-none p-3 pr-4 min-h-[48px] max-h-[120px]"
          @keydown="handleKeydown" @input="handleInput" />
      </div>

      <!-- Send Button -->
      <Button type="submit" :disabled="isDisabled || !message.trim()"
        class="bg-slate-700 text-white rounded-full p-3 h-12 w-12 flex-shrink-0 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
        <IconSendOutline v-if="!isSubmitting"></IconSendOutline>
        <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </Button>
    </form>

    <!-- Keyboard shortcut hint -->
    <div class="mt-2 text-xs text-gray-500 text-center">
      Appuyez sur <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs">Entrée</kbd> pour envoyer,
      <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs">Maj + Entrée</kbd> pour une nouvelle
      ligne
    </div>
  </div>
</template>

<style scoped>
kbd {
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}
</style>
