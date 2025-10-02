import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatList from './ChatList.vue'

describe('ChatList', () => {
  const mockCurrentUser = {
    id: 1,
    name: 'John Doe',
    matrixLogin: '@john:matrix.org',
  }

  const mockRooms = [
    {
      matrixRoomId: 'room1',
      deal: {
        id: 1,
        title: 'Laptop',
        price: 1000,
      },
      buyer: {
        id: 1,
        name: 'John Doe',
      },
      seller: {
        id: 2,
        name: 'Jane Smith',
      },
      messages: [
        {
          id: '1',
          sender: '@john:matrix.org',
          body: 'Hello',
          ts: Date.now(),
        },
      ],
      lastActivity: Date.now(),
      unreadCount: 0,
    },
  ]

  it('renders search input', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: {
            template: '<input class="search-input" />',
          },
        },
      },
    })

    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('renders room list', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Laptop')
  })

  it('displays contact name', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Jane Smith')
  })

  it('shows empty state when no rooms', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: [],
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Aucune conversation disponible')
  })

  it('calls onRoomSelect when room is clicked', async () => {
    const onRoomSelect = vi.fn()
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect,
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    const room = wrapper.findAll('.cursor-pointer')[0]
    await room.trigger('click')

    expect(onRoomSelect).toHaveBeenCalledWith('room1')
  })

  it('highlights selected room', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: 'room1',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    const room = wrapper.findAll('.cursor-pointer')[0]
    expect(room.classes()).toContain('bg-slate-100')
  })

  it('displays last message preview', () => {
    const wrapper = mount(ChatList, {
      props: {
        rooms: mockRooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Hello')
  })

  it('displays unread count badge when messages are unread', () => {
    const roomsWithUnread = [
      {
        ...mockRooms[0],
        unreadCount: 5,
      },
    ]

    const wrapper = mount(ChatList, {
      props: {
        rooms: roomsWithUnread,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
      },
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('5')
  })

  it('filters rooms by search query', async () => {
    const rooms = [
      {
        ...mockRooms[0],
        deal: { ...mockRooms[0].deal, title: 'Laptop' },
      },
      {
        matrixRoomId: 'room2',
        deal: {
          id: 2,
          title: 'Phone',
          price: 500,
        },
        buyer: mockCurrentUser,
        seller: { id: 3, name: 'Bob' },
        messages: [],
        lastActivity: Date.now(),
        unreadCount: 0,
      },
    ]

    const wrapper = mount(ChatList, {
      props: {
        rooms,
        currentUser: mockCurrentUser,
        selectedRoomId: '',
        onRoomSelect: vi.fn(),
        searchQuery: 'Laptop',
      },
      global: {
        stubs: {
          Input: {
            template: '<input v-model="modelValue" />',
            props: ['modelValue'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Laptop')
  })
})
