import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CTASection from './CTASection.vue'

describe('CTASection', () => {
  it('renders with all props', () => {
    const wrapper = mount(CTASection, {
      props: {
        title: 'Get Started Today',
        description: 'Join thousands of users',
        buttonText: 'Sign Up',
        buttonHref: '/register',
      },
    })

    expect(wrapper.find('.cta-title').text()).toBe('Get Started Today')
    expect(wrapper.find('.cta-description').text()).toBe('Join thousands of users')
    expect(wrapper.find('.cta-button').text()).toBe('Sign Up')
  })

  it('renders button with correct href', () => {
    const wrapper = mount(CTASection, {
      props: {
        title: 'Title',
        description: 'Description',
        buttonText: 'Click Me',
        buttonHref: '/action',
      },
    })

    const button = wrapper.find('.cta-button')
    expect(button.attributes('href')).toBe('/action')
  })

  it('renders with custom button href', () => {
    const wrapper = mount(CTASection, {
      props: {
        title: 'Title',
        description: 'Description',
        buttonText: 'Learn More',
        buttonHref: 'https://example.com/learn',
      },
    })

    expect(wrapper.find('.cta-button').attributes('href')).toBe('https://example.com/learn')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(CTASection, {
      props: {
        title: 'Title',
        description: 'Description',
        buttonText: 'Button',
        buttonHref: '/link',
      },
    })

    expect(wrapper.find('.cta-wrapper').exists()).toBe(true)
    expect(wrapper.find('.cta-container').exists()).toBe(true)
    expect(wrapper.find('.cta-title').exists()).toBe(true)
    expect(wrapper.find('.cta-description').exists()).toBe(true)
    expect(wrapper.find('.cta-button').exists()).toBe(true)
  })
})
