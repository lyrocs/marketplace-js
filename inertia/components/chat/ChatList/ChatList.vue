<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChatListProps, ChatRoom } from '~/types/chat'

const props = defineProps<ChatListProps>()

const searchQuery = ref(props.searchQuery || '')

const filteredRooms = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.rooms
  }

  const query = searchQuery.value.toLowerCase()
  return props.rooms.filter(room =>
    room.deal?.title?.toLowerCase().includes(query) ||
    room.buyer?.name?.toLowerCase().includes(query) ||
    room.seller?.name?.toLowerCase().includes(query)
  )
})

const sortedRooms = computed(() => {
  return [...filteredRooms.value].sort((a, b) => {
    const aLastActivity = a.lastActivity || 0
    const bLastActivity = b.lastActivity || 0
    return bLastActivity - aLastActivity
  })
})

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  props.onSearch?.(target.value)
}

const getLastMessagePreview = (room: ChatRoom): string => {
  const lastMessage = room.messages?.[room.messages.length - 1]
  return lastMessage?.body || 'Aucun message'
}

const getLastMessageTime = (room: ChatRoom): string => {
  const lastMessage = room.messages?.[room.messages.length - 1]
  if (!lastMessage) return ''

  const date = new Date(lastMessage.ts)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    })
  }
}

const getContactName = (room: ChatRoom): string => {
  if (!room.buyer || !room.seller) return 'Contact inconnu'

  return room.buyer.id === props.currentUser.id
    ? room.seller.name
    : room.buyer.name
}
</script>

<template>
  <div class="md:col-span-1 border-r flex flex-col h-full bg-slate-50/50">
    <!-- Search Header -->
    <div class="p-4 border-b flex-shrink-0">
      <Input type="search" v-model="searchQuery" placeholder="Rechercher..."
        class="w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500"
        @input="handleSearch">
      </Input>
    </div>

    <!-- Conversations List -->
    <div class="flex-grow overflow-y-auto">
      <div v-for="room in sortedRooms" :key="room.matrixRoomId"
        class="p-4 flex gap-4 cursor-pointer transition-colors hover:bg-slate-100" :class="{
          'bg-slate-100 border-l-4 border-slate-700 bg-white': selectedRoomId === room.matrixRoomId
        }" @click="props.onRoomSelect(room.matrixRoomId)">
        <!-- Avatar placeholder -->
        <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <span class="text-slate-600 font-medium text-sm">
            {{ getContactName(room).charAt(0).toUpperCase() }}
          </span>
        </div>

        <!-- Conversation Info -->
        <div class="w-full overflow-hidden">
          <div class="flex justify-between items-baseline mb-1">
            <p class="font-bold text-gray-800 truncate">
              {{ room.deal?.title || 'Conversation' }}
            </p>
            <span class="text-xs text-gray-500 flex-shrink-0">
              {{ getLastMessageTime(room) }}
            </span>
          </div>

          <p class="text-sm font-medium text-gray-600 truncate mb-1">
            {{ getContactName(room) }}
          </p>

          <p class="text-sm text-gray-500 truncate">
            {{ getLastMessagePreview(room) }}
          </p>

          <!-- Unread indicator -->
          <div v-if="room.unreadCount && room.unreadCount > 0"
            class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-slate-600 rounded-full mt-1">
            {{ room.unreadCount > 99 ? '99+' : room.unreadCount }}
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="sortedRooms.length === 0" class="p-8 text-center text-gray-500">
        <p v-if="searchQuery">
          Aucune conversation trouvée pour "{{ searchQuery }}"
        </p>
        <p v-else>
          Aucune conversation disponible
        </p>
      </div>
    </div>
  </div>
</template>
