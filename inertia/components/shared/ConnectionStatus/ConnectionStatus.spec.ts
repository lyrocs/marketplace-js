import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConnectionStatus from './ConnectionStatus.vue'

describe('ConnectionStatus', () => {
  it('shows connected state', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
    })

    expect(wrapper.text()).toContain('Connecté')
    expect(wrapper.find('.status-indicator').classes()).toContain('bg-green-500')
  })

  it('shows loading state', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: false,
        isLoading: true,
        hasError: false,
      },
    })

    expect(wrapper.text()).toContain('Connexion...')
    expect(wrapper.find('.status-indicator').classes()).toContain('bg-yellow-500')
  })

  it('shows disconnected state', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: false,
        isLoading: false,
        hasError: false,
      },
    })

    expect(wrapper.text()).toContain('Déconnecté')
  })

  it('shows error state', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: false,
        isLoading: false,
        hasError: true,
      },
    })

    expect(wrapper.text()).toContain('Déconnecté')
    expect(wrapper.find('.status-indicator').classes()).toContain('bg-red-500')
  })

  it('prioritizes loading state over error state', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: false,
        isLoading: true,
        hasError: true,
      },
    })

    expect(wrapper.text()).toContain('Connexion...')
    expect(wrapper.find('.status-indicator').classes()).toContain('bg-yellow-500')
    expect(wrapper.find('.status-indicator').classes()).not.toContain('bg-red-500')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ConnectionStatus, {
      props: {
        isConnected: true,
        isLoading: false,
        hasError: false,
      },
    })

    expect(wrapper.find('.connection-status').exists()).toBe(true)
    expect(wrapper.find('.status-indicator').exists()).toBe(true)
    expect(wrapper.find('.status-text').exists()).toBe(true)
  })
})
