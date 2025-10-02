import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatRoom from './ChatRoom.vue'

describe('ChatRoom', () => {
  const mockCurrentUser = {
    id: 1,
    name: 'John Doe',
    matrixLogin: '@john:matrix.org',
  }

  const mockRoom = {
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
      {
        id: '2',
        sender: '@jane:matrix.org',
        body: 'Hi there',
        ts: Date.now() + 1000,
      },
    ],
    loaded: true,
  }

  it('renders contact name', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Jane Smith')
  })

  it('renders deal title', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Laptop')
  })

  it('renders messages', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('Hi there')
  })

  it('renders MessageInput component', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: {
            template: '<div class="message-input"></div>',
          },
          Button: true,
        },
      },
    })

    expect(wrapper.find('.message-input').exists()).toBe(true)
  })

  it('shows loading spinner when isLoading is true', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: true,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('shows empty state when no messages', () => {
    const emptyRoom = {
      ...mockRoom,
      messages: [],
    }

    const wrapper = mount(ChatRoom, {
      props: {
        room: emptyRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Aucun message dans cette conversation')
  })

  it('shows no room selected message when room is null', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: null,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Sélectionnez une conversation')
  })

  it('renders deal price', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('1000')
  })

  it('renders link to deal', () => {
    const wrapper = mount(ChatRoom, {
      props: {
        room: mockRoom,
        currentUser: mockCurrentUser,
        isLoading: false,
        onSendMessage: vi.fn(),
        onLoadMore: vi.fn(),
      },
      global: {
        stubs: {
          MessageInput: true,
          Button: true,
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toContain('/deals/1')
  })
})
