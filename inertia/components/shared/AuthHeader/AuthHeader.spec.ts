import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthHeader from './AuthHeader.vue'

describe('AuthHeader', () => {
  it('renders with title and subtitle', () => {
    const wrapper = mount(AuthHeader, {
      props: {
        title: 'Sign in to your account',
        subtitle: 'Welcome back',
      },
    })

    expect(wrapper.find('.auth-title').text()).toBe('Sign in to your account')
    expect(wrapper.find('.auth-subtitle').text()).toBe('Welcome back')
  })

  it('renders logo with default href', () => {
    const wrapper = mount(AuthHeader, {
      props: {
        title: 'Sign in',
        subtitle: 'Welcome',
      },
    })

    const logo = wrapper.find('.auth-logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('href')).toBe('/')
    expect(logo.text()).toContain('Marketplace')
    expect(logo.text()).toContain('.js')
  })

  it('renders logo with custom href', () => {
    const wrapper = mount(AuthHeader, {
      props: {
        title: 'Sign in',
        subtitle: 'Welcome',
        logoHref: '/home',
      },
    })

    const logo = wrapper.find('.auth-logo')
    expect(logo.attributes('href')).toBe('/home')
  })

  it('renders logo accent', () => {
    const wrapper = mount(AuthHeader, {
      props: {
        title: 'Sign in',
        subtitle: 'Welcome',
      },
    })

    expect(wrapper.find('.auth-logo-accent').exists()).toBe(true)
    expect(wrapper.find('.auth-logo-accent').text()).toBe('.js')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(AuthHeader, {
      props: {
        title: 'Sign in',
        subtitle: 'Welcome',
      },
    })

    expect(wrapper.find('.auth-header').exists()).toBe(true)
    expect(wrapper.find('.auth-logo').exists()).toBe(true)
    expect(wrapper.find('.auth-logo-accent').exists()).toBe(true)
    expect(wrapper.find('.auth-title').exists()).toBe(true)
    expect(wrapper.find('.auth-subtitle').exists()).toBe(true)
  })
})
