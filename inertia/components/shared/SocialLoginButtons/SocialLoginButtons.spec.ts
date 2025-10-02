import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialLoginButtons from './SocialLoginButtons.vue'

describe('SocialLoginButtons', () => {
  it('renders empty when no providers', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [],
      },
    })

    expect(wrapper.findAll('.social-login-button').length).toBe(0)
  })

  it('renders single provider', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          {
            name: 'Sign in with Google',
            href: '/auth/google',
            icon: 'google',
          },
        ],
      },
    })

    expect(wrapper.findAll('.social-login-button').length).toBe(1)
    expect(wrapper.text()).toContain('Sign in with Google')
  })

  it('renders multiple providers', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Google', href: '/auth/google', icon: 'google' },
          { name: 'Facebook', href: '/auth/facebook', icon: 'facebook' },
        ],
      },
    })

    expect(wrapper.findAll('.social-login-button').length).toBe(2)
    expect(wrapper.text()).toContain('Google')
    expect(wrapper.text()).toContain('Facebook')
  })

  it('renders Google icon for google provider', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Google', href: '/auth/google', icon: 'google' },
        ],
      },
    })

    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders Facebook icon for facebook provider', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Facebook', href: '/auth/facebook', icon: 'facebook' },
        ],
      },
    })

    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('sets correct href for providers', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Google', href: '/auth/google', icon: 'google' },
          { name: 'Facebook', href: '/auth/facebook', icon: 'facebook' },
        ],
      },
    })

    const links = wrapper.findAll('.social-login-button')
    expect(links[0].attributes('href')).toBe('/auth/google')
    expect(links[1].attributes('href')).toBe('/auth/facebook')
  })

  it('renders provider names correctly', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Continue with Google', href: '/auth/google', icon: 'google' },
          { name: 'Continue with Facebook', href: '/auth/facebook', icon: 'facebook' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Continue with Google')
    expect(wrapper.text()).toContain('Continue with Facebook')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SocialLoginButtons, {
      props: {
        providers: [
          { name: 'Google', href: '/auth/google', icon: 'google' },
        ],
      },
    })

    expect(wrapper.find('.social-login-grid').exists()).toBe(true)
    expect(wrapper.find('.social-login-button').exists()).toBe(true)
  })
})
