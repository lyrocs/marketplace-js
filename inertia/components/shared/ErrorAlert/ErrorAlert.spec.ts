import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorAlert from './ErrorAlert.vue'

describe('ErrorAlert', () => {
  it('renders nothing when no errors provided', () => {
    const wrapper = mount(ErrorAlert, {
      props: {},
    })

    expect(wrapper.find('.error-alert-container').exists()).toBe(false)
  })

  it('renders nothing when errors object is empty', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {},
      },
    })

    expect(wrapper.find('.error-alert-container').exists()).toBe(false)
  })

  it('renders single error message', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {
          email: 'Email is required',
        },
      },
    })

    expect(wrapper.find('.error-alert-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('Email is required')
  })

  it('renders multiple error messages', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {
          email: 'Email is required',
          password: 'Password must be at least 8 characters',
          username: 'Username is taken',
        },
      },
    })

    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password must be at least 8 characters')
    expect(wrapper.text()).toContain('Username is taken')
  })

  it('renders correct number of error alerts', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {
          field1: 'Error 1',
          field2: 'Error 2',
          field3: 'Error 3',
        },
      },
    })

    expect(wrapper.findAll('.error-alert').length).toBe(3)
  })

  it('renders error icon for each error', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {
          email: 'Email is required',
          password: 'Password is required',
        },
      },
    })

    expect(wrapper.findAll('.error-alert-icon').length).toBe(2)
    expect(wrapper.findAll('svg').length).toBe(2)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {
          email: 'Email is required',
        },
      },
    })

    expect(wrapper.find('.error-alert-container').exists()).toBe(true)
    expect(wrapper.find('.error-alert').exists()).toBe(true)
    expect(wrapper.find('.error-alert-content').exists()).toBe(true)
    expect(wrapper.find('.error-alert-icon').exists()).toBe(true)
    expect(wrapper.find('.error-alert-text').exists()).toBe(true)
  })
})
