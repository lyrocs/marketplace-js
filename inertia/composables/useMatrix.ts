import * as sdk from 'matrix-js-sdk'
import { ref, type Ref } from 'vue'
import type UserDto from '#dtos/user'

export interface MatrixMessage {
  sender: string
  body: string
  ts: number
  id?: string
}

export interface MatrixRoom {
  roomId: string
  name: string
  messages: MatrixMessage[]
  lastActivity?: number
}

export interface UseMatrixOptions {
  user: UserDto
  matrixHost: string
  onError?: (error: Error) => void
  onConnected?: () => void
}

export interface UseMatrixReturn {
  client: Ref<any | null>
  isConnected: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  rooms: Ref<MatrixRoom[]>
  connect: () => Promise<void>
  disconnect: () => void
  sendMessage: (roomId: string, message: string) => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
}

export function useMatrix(options: UseMatrixOptions): UseMatrixReturn {
  const client = ref<any | null>(null)
  const isConnected = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const rooms = ref<MatrixRoom[]>([])
  const accessToken = ref<string | null>(null)

  const { user, matrixHost, onError, onConnected } = options

  const clearError = () => {
    error.value = null
  }

  const setError = (err: Error | string) => {
    const errorMessage = err instanceof Error ? err.message : err
    error.value = errorMessage
    onError?.(err instanceof Error ? err : new Error(errorMessage))
  }

  const loginMatrix = async (): Promise<string> => {
    if (!user?.matrixLogin || !user?.matrixPassword) {
      throw new Error('Matrix login credentials are missing')
    }

    const response = await fetch(`https://${matrixHost}/_matrix/client/v3/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'm.login.password',
        user: user.matrixLogin,
        password: user.matrixPassword,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Login failed: ${data.error || 'Unknown error'}`)
    }

    return data.access_token
  }

  const initializeClient = (token: string) => {
    const newClient = sdk.createClient({
      baseUrl: `https://${matrixHost}`,
      accessToken: token,
      userId: user.matrixLogin!,
    })

    // Set up event listeners
    newClient.once(sdk.ClientEvent.Sync as any, (state: string) => {
      if (state === 'PREPARED') {
        isConnected.value = true
        isLoading.value = false
        loadRooms(newClient)
        setupMessageListener(newClient)
        setupInviteListener(newClient)
        onConnected?.()
      }
    })

    newClient.on(sdk.ClientEvent.Sync as any, (state: string) => {
      if (state === 'ERROR') {
        setError('Sync error occurred')
      }
    })

    return newClient
  }

  const loadRooms = (matrixClient: any) => {
    const matrixRooms = matrixClient.getRooms()
    
    rooms.value = matrixRooms.map((room: any) => {
      const messages = room.timeline
        ?.filter((event: any) => event.getType() === 'm.room.message')
        .map((event: any) => ({
          sender: event.getSender()!,
          body: event.getContent().body,
          ts: event.getTs(),
          id: event.getId(),
        })) || []

      return {
        roomId: room.roomId,
        name: room.name || 'Unnamed Room',
        messages,
        lastActivity: messages.length > 0 ? Math.max(...messages.map((m: any) => m.ts)) : 0,
      }
    })
  }

  const setupMessageListener = (matrixClient: any) => {
    matrixClient.on(sdk.RoomEvent.Timeline, (event: any, room: any, toStartOfTimeline?: boolean) => {
      if (toStartOfTimeline || event.getType() !== 'm.room.message') {
        return
      }

      if (!room) return

      const roomIndex = rooms.value.findIndex(r => r.roomId === room.roomId)
      if (roomIndex !== -1) {
        const newMessage: MatrixMessage = {
          sender: event.getSender()!,
          body: event.getContent().body,
          ts: event.getTs(),
          id: event.getId(),
        }

        rooms.value[roomIndex].messages.push(newMessage)
        rooms.value[roomIndex].lastActivity = newMessage.ts
      }
    })
  }

  const setupInviteListener = (matrixClient: any) => {
    matrixClient.on('RoomMember.membership' as any, (_event: any, member: any) => {
      if (
        member.userId === matrixClient.getUserId() &&
        member.membership === 'invite'
      ) {
        joinRoom(member.roomId).catch((err: any) => {
          console.error(`Failed to join room ${member.roomId}:`, err)
        })
      }
    })
  }

  const connect = async () => {
    if (isLoading.value || isConnected.value) return

    try {
      clearError()
      isLoading.value = true

      const token = await loginMatrix()
      accessToken.value = token

      const newClient = initializeClient(token)
      client.value = newClient

      newClient.startClient()
    } catch (err) {
      isLoading.value = false
      setError(err as Error)
      throw err
    }
  }

  const disconnect = () => {
    if (client.value) {
      client.value.stopClient()
      client.value = null
    }
    isConnected.value = false
    isLoading.value = false
    accessToken.value = null
    rooms.value = []
  }

  const sendMessage = async (roomId: string, message: string) => {
    if (!client.value || !isConnected.value) {
      throw new Error('Matrix client is not connected')
    }

    if (!message.trim()) {
      throw new Error('Message cannot be empty')
    }

    try {
      await client.value.sendEvent(roomId, sdk.EventType.RoomMessage, {
        body: message.trim(),
        msgtype: sdk.MsgType.Text,
      })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const joinRoom = async (roomId: string) => {
    if (!client.value) {
      throw new Error('Matrix client is not initialized')
    }

    try {
      await client.value.joinRoom(roomId)
      console.log(`Joined room ${roomId} automatically`)
      // Refresh rooms after joining
      if (isConnected.value) {
        loadRooms(client.value)
      }
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    client,
    isConnected,
    isLoading,
    error,
    rooms,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
  }
}
