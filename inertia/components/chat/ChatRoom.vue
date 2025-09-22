<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, ref } from 'vue'
import type { ChatRoomProps } from '~/types/chat'
import { IconArrowForwardIos, IconChatBubbleOutline } from '@iconify-prerendered/vue-material-symbols'
import MessageInput from './MessageInput.vue'

const props = defineProps<ChatRoomProps>()

const messagesContainer = ref<HTMLElement>()

const contactName = computed(() => {
  if (!props.room?.buyer || !props.room?.seller) return 'Contact inconnu'

  return props.room.buyer.id === props.currentUser.id
    ? props.room.seller.name
    : props.room.buyer.name
})

const sortedMessages = computed(() => {
  if (!props.room?.messages) return []

  return [...props.room.messages]
    .sort((a, b) => a.ts - b.ts)
    .map(message => ({
      ...message,
      isOwn: message.sender === props.currentUser.matrixLogin
    }))
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffInDays === 1) {
    return `Hier ${date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: diffInDays > 365 ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const handleSendMessage = async (message: string) => {
  await props.onSendMessage(message)
  scrollToBottom()
}

onMounted(() => {
  scrollToBottom()
})

onUpdated(() => {
  scrollToBottom()
})
</script>

<template>
  <div v-if="room" class="md:col-span-3 flex flex-col overflow-y-auto">
    <!-- Chat Header -->
    <div class="p-4 border-b flex items-center gap-4 flex-shrink-0 bg-white">
      <!-- Contact Avatar -->
      <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
        <span class="text-slate-600 font-medium">
          {{ contactName.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- Contact Info -->
      <div class="flex-grow">
        <p class="font-bold text-lg text-gray-800">
          {{ contactName }}
        </p>
        <p class="text-sm text-gray-500">
          En ligne
        </p>
      </div>

      <!-- Deal Info -->
      <div class="ml-auto flex items-center gap-3 border-l pl-4">
        <img src="https://placehold.co/100x100/64748b/white?text=product" class="w-12 h-12 rounded-md object-cover"
          alt="produit">
        <div>
          <p class="font-semibold text-gray-700">
            {{ room.deal?.title || 'Produit' }}
          </p>
          <p class="text-gray-500">
            {{ room.deal?.price ? `${room.deal.price} €` : 'Prix non défini' }}
          </p>
        </div>
        <a :href="room.deal?.id ? `/deals/${room.deal?.id}` : ''"
          class="ml-2 text-slate-400 hover:text-slate-700 transition-colors" title="Voir l'annonce">

          <IconArrowForwardIos class="w-4 h-4"></IconArrowForwardIos>
        </a>
      </div>
    </div>

    <!-- Messages Container -->
    <div ref="messagesContainer" class="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center h-32">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
      </div>

      <!-- Messages -->
      <div v-for="message in sortedMessages" :key="message.id || `${message.sender}-${message.ts}`"
        class="flex items-end gap-3" :class="{ 'justify-end': message.isOwn }">
        <!-- Avatar for other users -->
        <div v-if="!message.isOwn"
          class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
          <span class="text-slate-600 text-xs font-medium">
            {{ contactName.charAt(0).toUpperCase() }}
          </span>
        </div>

        <!-- Message Bubble -->
        <div class="rounded-2xl p-3 shadow-sm max-w-lg border" :class="{
          'bg-slate-700 text-white border-slate-700': message.isOwn,
          'bg-white text-gray-800 border-gray-200': !message.isOwn
        }">
          <p class="text-sm whitespace-pre-wrap break-words">
            {{ message.body }}
          </p>
          <p class="text-xs mt-1" :class="{
            'text-slate-300': message.isOwn,
            'text-gray-500': !message.isOwn
          }">
            {{ formatMessageTime(message.ts) }}
          </p>
        </div>

        <!-- Avatar for own messages -->
        <div v-if="message.isOwn"
          class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs font-medium">
            {{ currentUser.name?.charAt(0).toUpperCase() || 'M' }}
          </span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && sortedMessages.length === 0"
        class="flex flex-col items-center justify-center h-32 text-gray-500">
        <IconChatBubbleOutline class="text-4xl mb-2" />
        <p>Aucun message dans cette conversation</p>
        <p class="text-sm">Envoyez le premier message !</p>
      </div>
    </div>

    <!-- Message Input -->
    <MessageInput :disabled="isLoading" placeholder="Écrivez votre message..." @send="handleSendMessage" />
  </div>

  <!-- No room selected -->
  <div v-else class="md:col-span-3 flex flex-col items-center justify-center h-full bg-slate-50 text-gray-500">
    <IconChatBubbleOutline class="text-6xl mb-4" />
    <h3 class="text-xl font-medium mb-2">Sélectionnez une conversation</h3>
    <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
  </div>
</template>
