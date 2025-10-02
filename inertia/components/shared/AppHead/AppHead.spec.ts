import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHead from './AppHead.vue'

// Mock the Inertia Head component
vi.mock('@inertiajs/vue3', () => ({
  Head: {
    name: 'Head',
    template: '<div><slot /></div>',
  },
}))

describe('AppHead', () => {
  it('renders with title', () => {
    const wrapper = mount(AppHead, {
      props: {
        title: 'Home Page',
        description: 'Welcome to our site',
      },
    })

    expect(wrapper.html()).toContain('<title>Home Page</title>')
  })

  it('renders with description meta tag', () => {
    const wrapper = mount(AppHead, {
      props: {
        title: 'About Us',
        description: 'Learn more about our company',
      },
    })

    expect(wrapper.html()).toContain('name="description"')
    expect(wrapper.html()).toContain('content="Learn more about our company"')
  })

  it('renders with different title and description', () => {
    const wrapper = mount(AppHead, {
      props: {
        title: 'Contact Page',
        description: 'Get in touch with us',
      },
    })

    expect(wrapper.html()).toContain('<title>Contact Page</title>')
    expect(wrapper.html()).toContain('content="Get in touch with us"')
  })

  it('renders meta tag with correct attributes', () => {
    const wrapper = mount(AppHead, {
      props: {
        title: 'Test',
        description: 'Test description',
      },
    })

    const meta = wrapper.find('meta[name="description"]')
    expect(meta.exists()).toBe(true)
    expect(meta.attributes('content')).toBe('Test description')
  })
})
