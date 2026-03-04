import { ref } from 'vue'
import type UserDto from '#dtos/user'
import type MessageDto from '#dtos/message'

export interface ChatMessage {
  id: number
  senderId: string
  body: string
  ts: number
}

export interface UseChatOptions {
  user: UserDto
}

export function useChat(options: UseChatOptions) {
  const rooms = ref<Record<number, ChatMessage[]>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let pollInterval: ReturnType<typeof setInterval> | null = null

  function messageFromDto(dto: MessageDto): ChatMessage {
    return {
      id: dto.id,
      senderId: dto.senderId,
      body: dto.body,
      ts: new Date(dto.createdAt).getTime(),
    }
  }

  function getLastId(discussionId: number): number | undefined {
    const msgs = rooms.value[discussionId]
    if (!msgs || msgs.length === 0) return undefined
    return msgs[msgs.length - 1].id
  }

  async function fetchMessages(discussionId: number, afterId?: number) {
    const url = afterId
      ? `/chat/${discussionId}/messages?after=${afterId}`
      : `/chat/${discussionId}/messages`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return
    const data: MessageDto[] = await res.json()

    if (afterId !== undefined) {
      // Polling: append only new messages
      if (data.length > 0) {
        rooms.value[discussionId] = [...(rooms.value[discussionId] ?? []), ...data.map(messageFromDto)]
      }
    } else {
      // Initial load: always replace (even with empty array to mark as initialized)
      rooms.value[discussionId] = data.map(messageFromDto)
    }
  }

  /**
   * Seed a room with server-preloaded messages so history is available
   * immediately and is never lost if the fetch fails.
   */
  function seedRoom(discussionId: number, preloaded: MessageDto[]) {
    if (rooms.value[discussionId] === undefined) {
      rooms.value[discussionId] = preloaded.map(messageFromDto)
    }
  }

  async function selectRoom(discussionId: number) {
    stopPolling()
    if (rooms.value[discussionId] === undefined) {
      isLoading.value = true
      try {
        await fetchMessages(discussionId)
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load messages'
      } finally {
        isLoading.value = false
      }
    }
    startPolling(discussionId)
  }

  async function sendMessage(discussionId: number, message: string) {
    const body = message.trim()
    if (!body) return

    const res = await fetch(`/chat/${discussionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      body: JSON.stringify({ body }),
    })
    if (!res.ok) {
      throw new Error('Failed to send message')
    }
    const dto: MessageDto = await res.json()
    rooms.value[discussionId] = [...(rooms.value[discussionId] ?? []), messageFromDto(dto)]
  }

  function startPolling(discussionId: number) {
    pollInterval = setInterval(async () => {
      try {
        const afterId = getLastId(discussionId)
        await fetchMessages(discussionId, afterId)
      } catch {
        // silently ignore polling errors
      }
    }, 3000)
  }

  function stopPolling() {
    if (pollInterval !== null) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ''
  }

  return { rooms, isLoading, error, sendMessage, selectRoom, seedRoom, stopPolling }
}
