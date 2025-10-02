import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormInput from './FormInput.vue'

describe('FormInput', () => {
  it('renders with label and id', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email Address',
        modelValue: '',
      },
    })

    const label = wrapper.find('label')
    expect(label.text()).toBe('Email Address')
    expect(label.attributes('for')).toBe('email')

    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('email')
  })

  it('renders with default type text', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'username',
        label: 'Username',
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('renders with custom type', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'password',
        label: 'Password',
        type: 'password',
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('displays model value', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: 'test@example.com',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('test@example.com')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('new@example.com')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new@example.com'])
  })

  it('applies error styling when error prop is present', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
        error: 'Invalid email',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('form-input-error')
    expect(input.classes()).not.toContain('form-input-default')
  })

  it('applies default styling when no error', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('form-input-default')
    expect(input.classes()).not.toContain('form-input-error')
  })

  it('renders helper link when provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'password',
        label: 'Password',
        modelValue: '',
        helperLink: {
          text: 'Forgot password?',
          href: '/forgot-password',
        },
      },
    })

    const link = wrapper.find('.form-input-helper-link')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Forgot password?')
    expect(link.attributes('href')).toBe('/forgot-password')
  })

  it('does not render helper link when not provided', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
      },
    })

    expect(wrapper.find('.form-input-helper').exists()).toBe(false)
  })

  it('sets autocomplete attribute', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
        autocomplete: 'email',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('autocomplete')).toBe('email')
  })

  it('sets required attribute when true', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
        required: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('required')).toBeDefined()
  })

  it('does not set required attribute by default', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('required')).toBeUndefined()
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'email',
        label: 'Email',
        modelValue: '',
      },
    })

    expect(wrapper.find('.form-input-header').exists()).toBe(true)
    expect(wrapper.find('.form-input-label').exists()).toBe(true)
    expect(wrapper.find('.form-input').exists()).toBe(true)
  })
})
