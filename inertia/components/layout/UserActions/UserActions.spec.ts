import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserActions from './UserActions.vue'

describe('UserActions', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    isAdmin: false,
  }

  it('renders container with correct layout classes', () => {
    const wrapper = mount(UserActions, {
      global: {
        stubs: {
          SellButton: true,
          UserButton: true,
        },
      },
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('gap-4')
  })

  it('renders SellButton component', () => {
    const wrapper = mount(UserActions, {
      global: {
        stubs: {
          SellButton: {
            template: '<div class="sell-button"></div>',
          },
          UserButton: true,
        },
      },
    })

    expect(wrapper.find('.sell-button').exists()).toBe(true)
  })

  it('renders UserButton component', () => {
    const wrapper = mount(UserActions, {
      global: {
        stubs: {
          SellButton: true,
          UserButton: {
            template: '<div class="user-button"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.user-button').exists()).toBe(true)
  })

  it('renders with user prop', () => {
    const wrapper = mount(UserActions, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          SellButton: true,
          UserButton: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with unreadMessagesCount', () => {
    const wrapper = mount(UserActions, {
      props: {
        unreadMessagesCount: 5,
      },
      global: {
        stubs: {
          SellButton: true,
          UserButton: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders SellButton and UserButton together', () => {
    const wrapper = mount(UserActions, {
      global: {
        stubs: {
          SellButton: {
            template: '<div class="sell-button"></div>',
          },
          UserButton: {
            template: '<div class="user-button"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.sell-button').exists()).toBe(true)
    expect(wrapper.find('.user-button').exists()).toBe(true)
  })

  it('renders both components when user is logged in', () => {
    const wrapper = mount(UserActions, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          SellButton: {
            template: '<div class="sell-button"></div>',
          },
          UserButton: {
            template: '<div class="user-button"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.sell-button').exists()).toBe(true)
    expect(wrapper.find('.user-button').exists()).toBe(true)
  })
})
