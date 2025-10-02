import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormSection from './FormSection.vue'

describe('FormSection', () => {
  it('renders with title', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'Personal Information',
      },
    })

    expect(wrapper.find('.form-section-title').text()).toBe('Personal Information')
  })

  it('renders default slot content', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'Form Section',
      },
      slots: {
        default: '<div class="test-content">Form content here</div>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Form content here')
  })

  it('renders actions slot when provided', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'Form Section',
      },
      slots: {
        actions: '<button class="test-button">Save</button>',
      },
    })

    expect(wrapper.find('.form-section-actions').exists()).toBe(true)
    expect(wrapper.find('.test-button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Save')
  })

  it('does not render actions container when no actions slot', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'Form Section',
      },
    })

    expect(wrapper.find('.form-section-actions').exists()).toBe(false)
  })

  it('renders both default and actions slots together', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'User Settings',
      },
      slots: {
        default: '<input class="test-input" />',
        actions: '<button class="test-action">Submit</button>',
      },
    })

    expect(wrapper.find('.test-input').exists()).toBe(true)
    expect(wrapper.find('.test-action').exists()).toBe(true)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(FormSection, {
      props: {
        title: 'Test',
      },
    })

    expect(wrapper.find('.form-section').exists()).toBe(true)
    expect(wrapper.find('.form-section-header').exists()).toBe(true)
    expect(wrapper.find('.form-section-title').exists()).toBe(true)
    expect(wrapper.find('.form-section-content').exists()).toBe(true)
  })
})
