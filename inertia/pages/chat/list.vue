<script setup lang="ts">
import { onUnmounted, ref, computed } from 'vue'
import { useChat } from '~/composables/useChat'
import { router } from '@inertiajs/vue3'
import type UserDto from '#dtos/user'
import type DiscussionDto from '#dtos/discussion'
import type { ChatRoom as ChatRoomType, ChatState } from '~/types/chat'

// Props
const props = defineProps<{
  user: UserDto
  unreadMessagesCount: number
  discussions: DiscussionDto[]
}>()

// State
const state = ref<ChatState>({
  selectedRoomId: null,
  searchQuery: '',
  isLoading: false,
  error: null,
})

// Chat composable
const {
  isLoading: chatLoading,
  error: chatError,
  rooms: chatRoomMessages,
  sendMessage: sendChatMessage,
  selectRoom,
  seedRoom,
  stopPolling,
} = useChat({ user: props.user })

// Computed properties
const chatRooms = computed<ChatRoomType[]>(() => {
  return props.discussions.map((discussion) => {
    // Use live messages if the room has been seeded/fetched, otherwise fall back
    // to server-preloaded messages. Live messages are always preferred because
    // they include any newly sent/received messages.
    const liveMessages = chatRoomMessages.value[discussion.id]
    const messages = liveMessages !== undefined
      ? liveMessages
      : (discussion.messages ?? []).map((m) => ({
          id: m.id,
          senderId: m.senderId,
          body: m.body,
          ts: new Date(m.createdAt).getTime(),
        }))

    return {
      ...discussion,
      messages,
      loaded: false,
      lastActivity: messages.length > 0 ? Math.max(...messages.map((m) => m.ts)) : 0,
      unreadCount: discussion.status.find((status) => status.userId === props.user.id)?.newMessages
        ? 1
        : 0,
    }
  })
})

const currentRoom = computed(() => {
  if (state.value.selectedRoomId === null) return null
  return chatRooms.value.find((room) => room.id === state.value.selectedRoomId) || null
})

const isLoading = computed(() => state.value.isLoading || chatLoading.value)

const error = computed(() => state.value.error || chatError.value)

// Methods
const handleRoomSelect = async (roomId: number) => {
  state.value.selectedRoomId = roomId
  state.value.error = null

  // Seed with server-preloaded messages BEFORE fetching, so history is never
  // lost even if the network fetch fails or takes time.
  const discussion = props.discussions.find((d) => d.id === roomId)
  if (discussion?.messages) {
    seedRoom(roomId, discussion.messages)
  }

  await selectRoom(roomId)

  if (props.unreadMessagesCount > 0) {
    const selectedRoom = chatRooms.value.find((room) => room.id === roomId)
    if (selectedRoom?.unreadCount) {
      router.post(`/chat/${roomId}/read`)
    }
  }
}

const handleSearch = (query: string) => {
  state.value.searchQuery = query
}

const handleSendMessage = async (message: string) => {
  if (state.value.selectedRoomId === null) {
    throw new Error('No room selected')
  }

  try {
    state.value.isLoading = true
    await sendChatMessage(state.value.selectedRoomId, message)
  } catch (err) {
    console.error('Failed to send message:', err)
    state.value.error = err instanceof Error ? err.message : 'Failed to send message'
    throw err
  } finally {
    state.value.isLoading = false
  }
}

// Lifecycle
onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <main class="w-full mx-auto">
    <ErrorBanner v-if="error" :error="error" @dismiss="state.error = null" />

    <div class="bg-white rounded-xl shadow-lg h-[85vh] flex flex-col overflow-hidden">
      <ChatHeader :is-connected="true" :is-loading="isLoading" :has-error="!!error" />

      <div class="grid grid-cols-1 md:grid-cols-4 h-full overflow-hidden">
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
        />
      </div>
    </div>
  </main>
</template>
