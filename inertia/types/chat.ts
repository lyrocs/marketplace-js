import type DiscussionDto from '#dtos/discussion'
import type UserDto from '#dtos/user'

export interface ChatMessage {
  id?: string
  sender: string
  body: string
  ts: number
  isOwn?: boolean
}

export interface ChatRoom extends DiscussionDto {
  messages: ChatMessage[]
  lastActivity?: number
  loaded?: boolean
  unreadCount?: number
}

export interface ChatUser extends UserDto {
  isOnline?: boolean
  lastSeen?: number
}

export interface ChatListProps {
  rooms: ChatRoom[]
  selectedRoomId: string | null
  currentUser: ChatUser
  searchQuery?: string
  onRoomSelect: (roomId: string) => void
  onSearch?: (query: string) => void
}

export interface ChatRoomProps {
  room: ChatRoom | null
  currentUser: ChatUser
  isLoading?: boolean
  onSendMessage: (message: string) => void
  onLoadMore?: (roomId: string) => void
}

export interface MessageInputProps {
  disabled?: boolean
  placeholder?: string
  onSend: (message: string) => void
}

export interface ChatState {
  selectedRoomId: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
}
