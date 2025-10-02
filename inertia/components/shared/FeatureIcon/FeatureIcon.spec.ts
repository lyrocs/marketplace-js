import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FeatureIcon from './FeatureIcon.vue'

describe('FeatureIcon', () => {
  it('renders default slot for icon', () => {
    const wrapper = mount(FeatureIcon, {
      slots: {
        default: '<svg class="test-icon"></svg>',
      },
    })

    expect(wrapper.find('.feature-icon').exists()).toBe(true)
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('renders title slot', () => {
    const wrapper = mount(FeatureIcon, {
      slots: {
        title: 'Feature Title',
      },
    })

    expect(wrapper.find('.feature-icon-title').text()).toBe('Feature Title')
  })

  it('renders description slot', () => {
    const wrapper = mount(FeatureIcon, {
      slots: {
        description: 'This is a feature description',
      },
    })

    expect(wrapper.find('.feature-icon-description').text()).toBe('This is a feature description')
  })

  it('renders all slots together', () => {
    const wrapper = mount(FeatureIcon, {
      slots: {
        default: '<span class="icon">Icon</span>',
        title: 'Fast Performance',
        description: 'Lightning fast speeds',
      },
    })

    expect(wrapper.find('.icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Icon')
    expect(wrapper.text()).toContain('Fast Performance')
    expect(wrapper.text()).toContain('Lightning fast speeds')
  })

  it('renders empty when no slots provided', () => {
    const wrapper = mount(FeatureIcon)

    expect(wrapper.find('.feature-icon').exists()).toBe(true)
    expect(wrapper.find('.feature-icon-title').exists()).toBe(true)
    expect(wrapper.find('.feature-icon-description').exists()).toBe(true)
    expect(wrapper.find('.feature-icon').text()).toBe('')
    expect(wrapper.find('.feature-icon-title').text()).toBe('')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(FeatureIcon, {
      slots: {
        default: 'Icon',
        title: 'Title',
        description: 'Description',
      },
    })

    expect(wrapper.find('.feature-icon').exists()).toBe(true)
    expect(wrapper.find('.feature-icon-title').exists()).toBe(true)
    expect(wrapper.find('.feature-icon-description').exists()).toBe(true)
  })
})
