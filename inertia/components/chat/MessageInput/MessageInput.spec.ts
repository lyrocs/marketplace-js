import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageInput from './MessageInput.vue'

describe('MessageInput', () => {
  it('renders with default placeholder', () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with custom placeholder', () => {
    const wrapper = mount(MessageInput, {
      props: {
        placeholder: 'Type your message...',
      },
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('emits send event with trimmed message on submit', async () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.message = '  Hello World  '
    await vm.handleSubmit()

    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')?.[0]).toEqual(['Hello World'])
  })

  it('does not emit send event with empty message', async () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.message = '   '
    await vm.handleSubmit()

    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('does not emit send event when disabled', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        disabled: true,
      },
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.message = 'Test message'
    await vm.handleSubmit()

    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('clears message after sending', async () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.message = 'Test message'
    await vm.handleSubmit()

    expect(vm.message).toBe('')
  })

  it('handles Enter key to submit', () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    vm.handleKeydown(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('does not submit on Shift+Enter', () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.message = 'Test'
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    vm.handleKeydown(event)

    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('computes isDisabled correctly when disabled prop is true', () => {
    const wrapper = mount(MessageInput, {
      props: {
        disabled: true,
      },
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.isDisabled).toBe(true)
  })

  it('computes isDisabled correctly when submitting', async () => {
    const wrapper = mount(MessageInput, {
      global: {
        stubs: {
          Textarea: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.isSubmitting = true

    expect(vm.isDisabled).toBe(true)
  })
})
