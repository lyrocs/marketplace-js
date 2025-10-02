import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatHeader from './ChatHeader.vue'

describe('ChatHeader', () => {
  it('renders chat title', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Messagerie')
  })

  it('renders ConnectionStatus component', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: {
            template: '<div class="connection-status"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.connection-status').exists()).toBe(true)
  })

  it('renders with isConnected prop', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with isLoading prop', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: false,
        isLoading: true,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with hasError prop', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: false,
        isLoading: false,
        hasError: true,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('shows loading indicator when isLoading is true', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: false,
        isLoading: true,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.find('.chat-header-loading').exists()).toBe(true)
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Chargement...')
  })

  it('hides loading indicator when isLoading is false', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    expect(wrapper.find('.chat-header-loading').exists()).toBe(false)
  })

  it('applies correct CSS classes to header', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    const header = wrapper.find('.chat-header')
    expect(header.exists()).toBe(true)
  })

  it('renders chat title with correct styling', () => {
    const wrapper = mount(ChatHeader, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
      global: {
        stubs: {
          ConnectionStatus: true,
        },
      },
    })

    const title = wrapper.find('.chat-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Messagerie')
  })
})
