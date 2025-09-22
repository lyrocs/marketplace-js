<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useMatrix } from '~/composables/useMatrix'
import { router } from '@inertiajs/vue3'
import ChatList from '~/components/chat/ChatList.vue'
import ChatRoom from '~/components/chat/ChatRoom.vue'
import { IconCloudAlertOutline, IconCloseSmall } from '@iconify-prerendered/vue-material-symbols'
import type UserDto from '#dtos/user'
import type DiscussionDto from '#dtos/discussion'
import type { ChatRoom as ChatRoomType, ChatState } from '~/types/chat'

// Props
const props = defineProps<{
  user: UserDto
  matrixHost: string
  unreadMessagesCount: number
  discussions: (DiscussionDto & { messages?: Array<{ sender: string; body: string; ts: number }> })[]
}>()

// State
const state = ref<ChatState>({
  selectedRoomId: null,
  searchQuery: '',
  isLoading: false,
  error: null
})

// Matrix composable
const {
  isConnected,
  isLoading: matrixLoading,
  error: matrixError,
  rooms: matrixRooms,
  connect,
  sendMessage: sendMatrixMessage
} = useMatrix({
  user: props.user,
  matrixHost: props.matrixHost,
  onError: (error) => {
    state.value.error = error.message
    console.error('Matrix error:', error)
  },
  onConnected: () => {
    console.log('Matrix client connected successfully')
    // Auto-select first room if available
    if (chatRooms.value.length > 0 && !state.value.selectedRoomId) {
      handleRoomSelect(chatRooms.value[0].matrixRoomId)
    }
  }
})

// Computed properties
const chatRooms = computed<ChatRoomType[]>(() => {
  // Merge discussions with matrix rooms data
  return props.discussions.map(discussion => {
    const matrixRoom = matrixRooms.value.find(r => r.roomId === discussion.matrixRoomId)
    const messages = matrixRoom?.messages || discussion.messages || []

    return {
      ...discussion,
      messages,
      lastActivity: messages.length > 0 ? Math.max(...messages.map(m => m.ts)) : 0,
      unreadCount: discussion.status.find(status => status.userId === props.user.id)?.newMessages ? 1 : 0
    }
  })
})

const currentRoom = computed(() => {
  if (!state.value.selectedRoomId) return null
  return chatRooms.value.find(room => room.matrixRoomId === state.value.selectedRoomId) || null
})

const isLoading = computed(() => {
  return state.value.isLoading || matrixLoading.value
})

const error = computed(() => {
  return state.value.error || matrixError.value
})

// Methods
const handleRoomSelect = async (roomId: string) => {
  state.value.selectedRoomId = roomId
  state.value.error = null
  if (props.unreadMessagesCount > 0) {
    const selectedRoom = chatRooms.value.find(room => room.matrixRoomId === roomId)
    if (!selectedRoom) {
      return
    }
    const discussionId = selectedRoom.id
    const unreadMessagesCount = selectedRoom.unreadCount
    if (!unreadMessagesCount) {
      return
    }
    router.post(`/chat/${discussionId}/read`)
  }
}

const handleSearch = (query: string) => {
  state.value.searchQuery = query
}

const handleSendMessage = async (message: string) => {
  if (!state.value.selectedRoomId || !isConnected.value) {
    throw new Error('No room selected or not connected')
  }

  try {
    state.value.isLoading = true
    await sendMatrixMessage(state.value.selectedRoomId, message)
  } catch (error) {
    console.error('Failed to send message:', error)
    state.value.error = error instanceof Error ? error.message : 'Failed to send message'
    throw error
  } finally {
    state.value.isLoading = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    state.value.isLoading = true
    await connect()
  } catch (error) {
    console.error('Failed to connect to Matrix:', error)
    state.value.error = error instanceof Error ? error.message : 'Failed to connect'
  } finally {
    state.value.isLoading = false
  }
})

// Watch for errors and clear them after some time
watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      if (state.value.error === newError) {
        state.value.error = null
      }
    }, 5000)
  }
})
</script>

<template>
  <main class="w-full mx-auto">
    <!-- Error Banner -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
      <IconCloudAlertOutline class="text-red-500 text-xl flex-shrink-0"></IconCloudAlertOutline>
      <div class="flex-grow">
        <p class="text-red-800 font-medium">Erreur de connexion</p>
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>
      <button @click="state.error = null" class="text-red-500 hover:text-red-700 transition-colors">
        <IconCloseSmall class="text-xl"></IconCloseSmall>
      </button>
    </div>

    <!-- Main Chat Container -->
    <div class="bg-white rounded-xl shadow-lg h-[85vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center flex-shrink-0">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-800">Messagerie</h1>

          <!-- Connection Status -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="{
              'bg-green-500': isConnected,
              'bg-yellow-500': isLoading,
              'bg-red-500': error && !isLoading
            }"></div>
            <span class="text-sm text-gray-600">
              {{ isConnected ? 'Connecté' : isLoading ? 'Connexion...' : 'Déconnecté' }}
            </span>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex items-center gap-2 text-gray-600">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
          <span class="text-sm">Chargement...</span>
        </div>
      </div>

      <!-- Chat Layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 h-full overflow-y-auto">
        <!-- Chat List -->
        <ChatList :rooms="chatRooms" :selected-room-id="state.selectedRoomId" :current-user="props.user"
          :search-query="state.searchQuery" @room-select="handleRoomSelect" @search="handleSearch" />

        <!-- Chat Room -->
        <ChatRoom :room="currentRoom" :current-user="props.user" :is-loading="isLoading"
          @send-message="handleSendMessage" />
      </div>
    </div>
  </main>
</template>