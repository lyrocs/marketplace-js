import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from './PageHeader.vue'

describe('PageHeader', () => {
  it('renders with title only', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'My Dashboard',
      },
    })

    expect(wrapper.find('.page-header-title').text()).toBe('My Dashboard')
  })

  it('renders with title and subtitle', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'My Dashboard',
        subtitle: 'Manage your account settings',
      },
    })

    expect(wrapper.find('.page-header-title').text()).toBe('My Dashboard')
    expect(wrapper.find('.page-header-subtitle').text()).toBe('Manage your account settings')
  })

  it('does not render subtitle when not provided', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'My Dashboard',
      },
    })

    expect(wrapper.find('.page-header-subtitle').exists()).toBe(false)
  })

  it('renders actions slot when provided', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'My Dashboard',
      },
      slots: {
        actions: '<button class="test-action">Add New</button>',
      },
    })

    expect(wrapper.find('.page-header-actions').exists()).toBe(true)
    expect(wrapper.find('.test-action').exists()).toBe(true)
    expect(wrapper.text()).toContain('Add New')
  })

  it('does not render actions container when no actions slot', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'My Dashboard',
      },
    })

    expect(wrapper.find('.page-header-actions').exists()).toBe(false)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'Test Title',
      },
    })

    expect(wrapper.find('.page-header').exists()).toBe(true)
    expect(wrapper.find('.page-header-container').exists()).toBe(true)
    expect(wrapper.find('.page-header-content').exists()).toBe(true)
    expect(wrapper.find('.page-header-text').exists()).toBe(true)
    expect(wrapper.find('.page-header-title').exists()).toBe(true)
  })
})
