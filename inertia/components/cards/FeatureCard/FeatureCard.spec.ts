import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FeatureCard from './FeatureCard.vue'

describe('FeatureCard', () => {
  it('renders with href', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/features',
      },
    })

    expect(wrapper.find('a').attributes('href')).toBe('/features')
  })

  it('renders icon slot', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/test',
      },
      slots: {
        icon: '<svg class="test-icon"></svg>',
      },
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('renders title slot', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/test',
      },
      slots: {
        title: 'Feature Title',
      },
    })

    expect(wrapper.find('.feature-card-title').text()).toBe('Feature Title')
  })

  it('renders description slot', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/test',
      },
      slots: {
        description: 'Feature description here',
      },
    })

    expect(wrapper.find('.feature-card-description').text()).toBe('Feature description here')
  })

  it('renders link slot', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/test',
      },
      slots: {
        link: 'Learn more →',
      },
    })

    expect(wrapper.find('.feature-card-link').text()).toBe('Learn more →')
  })

  it('renders all slots together', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/products',
      },
      slots: {
        icon: '<span class="icon">🎯</span>',
        title: 'Browse Products',
        description: 'Find what you need',
        link: 'View all',
      },
    })

    expect(wrapper.text()).toContain('🎯')
    expect(wrapper.text()).toContain('Browse Products')
    expect(wrapper.text()).toContain('Find what you need')
    expect(wrapper.text()).toContain('View all')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(FeatureCard, {
      props: {
        href: '/test',
      },
    })

    expect(wrapper.find('.feature-card').exists()).toBe(true)
    expect(wrapper.find('.feature-card-icon').exists()).toBe(true)
    expect(wrapper.find('.feature-card-title').exists()).toBe(true)
    expect(wrapper.find('.feature-card-description').exists()).toBe(true)
    expect(wrapper.find('.feature-card-link').exists()).toBe(true)
  })
})
