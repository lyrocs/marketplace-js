<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useMatrix } from '~/composables/useMatrix'
import { router } from '@inertiajs/vue3'
import ChatList from '~/components/chat/ChatList.vue'
import ChatRoom from '~/components/chat/ChatRoom.vue'
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
  sendMessage: sendMatrixMessage,
  loadMore
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
      loaded: matrixRoom?.loaded || false,
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

const handleLoadMore = async (roomId: string) => {
  await loadMore(roomId)
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
  <main class="chat-main">
    <ErrorBanner v-if="error" :error="error" @dismiss="state.error = null" />

    <div class="chat-container">
      <ChatHeader :is-connected="isConnected" :is-loading="isLoading" :has-error="!!error" />

      <div class="chat-layout">
        <ChatList
          :rooms="chatRooms"
          :selected-room-id="state.selectedRoomId"
          :current-user="props.user"
          :search-query="state.searchQuery"
          @room-select="handleRoomSelect"
          @search="handleSearch"
        />

        <ChatRoom
          :room="currentRoom"
          :current-user="props.user"
          :is-loading="isLoading"
          @send-message="handleSendMessage"
          @load-more="handleLoadMore"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.chat-main {
  @apply w-full mx-auto;
}

.chat-container {
  @apply bg-white rounded-xl shadow-lg h-[85vh] flex flex-col overflow-hidden;
}

.chat-layout {
  @apply grid grid-cols-1 md:grid-cols-4 h-full overflow-hidden;
}
</style>