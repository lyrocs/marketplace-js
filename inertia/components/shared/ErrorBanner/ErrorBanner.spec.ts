import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorBanner from './ErrorBanner.vue'

describe('ErrorBanner', () => {
  it('renders with error message', () => {
    const wrapper = mount(ErrorBanner, {
      props: {
        error: 'Connection failed',
      },
    })

    expect(wrapper.text()).toContain('Connection failed')
    expect(wrapper.text()).toContain('Erreur de connexion')
  })

  it('renders with custom title', () => {
    const wrapper = mount(ErrorBanner, {
      props: {
        error: 'Something went wrong',
        title: 'Custom Error',
      },
    })

    expect(wrapper.text()).toContain('Custom Error')
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('uses default title when not provided', () => {
    const wrapper = mount(ErrorBanner, {
      props: {
        error: 'Test error',
      },
    })

    expect(wrapper.text()).toContain('Erreur de connexion')
  })

  it('emits dismiss event when close button is clicked', async () => {
    const wrapper = mount(ErrorBanner, {
      props: {
        error: 'Test error',
      },
    })

    const dismissButton = wrapper.find('button')
    await dismissButton.trigger('click')

    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(wrapper.emitted('dismiss')?.length).toBe(1)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ErrorBanner, {
      props: {
        error: 'Test error',
      },
    })

    expect(wrapper.find('.error-banner').exists()).toBe(true)
    expect(wrapper.find('.error-icon').exists()).toBe(true)
    expect(wrapper.find('.error-content').exists()).toBe(true)
    expect(wrapper.find('.error-title').exists()).toBe(true)
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-dismiss').exists()).toBe(true)
  })
})
