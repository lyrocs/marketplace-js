import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageBanner from './PageBanner.vue'

describe('PageBanner', () => {
  it('renders with title and description', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Welcome to Marketplace',
        description: 'Find the best deals on FPV drones',
        backgroundImage: '/banner.jpg',
      },
    })

    expect(wrapper.find('.banner-title').text()).toBe('Welcome to Marketplace')
    expect(wrapper.find('.banner-description').text()).toBe('Find the best deals on FPV drones')
  })

  it('renders background image with correct src', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: 'https://example.com/image.jpg',
      },
    })

    const img = wrapper.find('.banner-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Banner')
  })

  it('renders slot content for actions', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/banner.jpg',
      },
      slots: {
        default: '<button class="test-button">Get Started</button>',
      },
    })

    expect(wrapper.find('.banner-actions').exists()).toBe(true)
    expect(wrapper.find('.test-button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Get Started')
  })

  it('renders without slot content', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/banner.jpg',
      },
    })

    expect(wrapper.find('.banner-actions').exists()).toBe(true)
  })

  it('renders overlay', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/banner.jpg',
      },
    })

    expect(wrapper.find('.banner-overlay').exists()).toBe(true)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(PageBanner, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/banner.jpg',
      },
    })

    expect(wrapper.find('.banner').exists()).toBe(true)
    expect(wrapper.find('.banner-image').exists()).toBe(true)
    expect(wrapper.find('.banner-overlay').exists()).toBe(true)
    expect(wrapper.find('.banner-content').exists()).toBe(true)
    expect(wrapper.find('.banner-title').exists()).toBe(true)
    expect(wrapper.find('.banner-description').exists()).toBe(true)
    expect(wrapper.find('.banner-actions').exists()).toBe(true)
  })
})
