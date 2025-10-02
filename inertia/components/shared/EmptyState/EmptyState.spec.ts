import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders with title and message', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No items found',
        message: 'Start by adding your first item',
      },
    })

    expect(wrapper.text()).toContain('No items found')
    expect(wrapper.text()).toContain('Start by adding your first item')
  })

  it('renders default icon when no icon slot provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        message: 'No data',
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders custom icon via slot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        message: 'No data',
      },
      slots: {
        icon: '<span class="custom-icon">Custom</span>',
      },
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom')
  })

  it('renders actions slot when provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        message: 'No data',
      },
      slots: {
        actions: '<button class="test-button">Add Item</button>',
      },
    })

    expect(wrapper.find('.empty-state-actions').exists()).toBe(true)
    expect(wrapper.find('.test-button').exists()).toBe(true)
  })

  it('does not render actions container when no actions slot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        message: 'No data',
      },
    })

    expect(wrapper.find('.empty-state-actions').exists()).toBe(false)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        message: 'No data',
      },
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state-container').exists()).toBe(true)
    expect(wrapper.find('.empty-state-icon').exists()).toBe(true)
    expect(wrapper.find('.empty-state-title').exists()).toBe(true)
    expect(wrapper.find('.empty-state-message').exists()).toBe(true)
  })
})
