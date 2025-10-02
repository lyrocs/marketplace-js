import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { toast } from 'vue-sonner'
import ToastManager from './ToastManager.vue'

vi.mock('vue-sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('ToastManager', () => {
  it('renders Sonner component', () => {
    const wrapper = mount(ToastManager, {
      props: {
        messages: {
          errorsBag: '',
          success: '',
        },
      },
      global: {
        stubs: {
          Sonner: {
            template: '<div class="sonner"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.sonner').exists()).toBe(true)
  })

  it('shows error toast for string error message', async () => {
    mount(ToastManager, {
      props: {
        messages: {
          errorsBag: 'Test error message',
          success: '',
        },
      },
      global: {
        stubs: {
          Sonner: true,
        },
      },
    })

    expect(toast.error).toHaveBeenCalledWith('An error occurred', {
      description: 'Test error message',
    })
  })

  it('shows success toast for string success message', async () => {
    mount(ToastManager, {
      props: {
        messages: {
          errorsBag: '',
          success: 'Operation successful',
        },
      },
      global: {
        stubs: {
          Sonner: true,
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith('Operation successful')
  })

  it('handles object error messages', async () => {
    mount(ToastManager, {
      props: {
        messages: {
          errorsBag: {
            field1: 'Error 1',
            field2: 'Error 2',
          },
          success: '',
        },
      },
      global: {
        stubs: {
          Sonner: true,
        },
      },
    })

    expect(toast.error).toHaveBeenCalledWith('An error occurred', {
      description: 'Error 1, Error 2',
    })
  })

  it('handles object success messages', async () => {
    mount(ToastManager, {
      props: {
        messages: {
          errorsBag: '',
          success: {
            msg1: 'Success 1',
            msg2: 'Success 2',
          },
        },
      },
      global: {
        stubs: {
          Sonner: true,
        },
      },
    })

    expect(toast.success).toHaveBeenCalledWith('Success 1, Success 2')
  })

  it('does not show toast for empty messages', async () => {
    vi.clearAllMocks()

    mount(ToastManager, {
      props: {
        messages: {
          errorsBag: '',
          success: '',
        },
      },
      global: {
        stubs: {
          Sonner: true,
        },
      },
    })

    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })
})
