import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserButton from './UserButton.vue'

describe('UserButton', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    isAdmin: false,
  }

  it('renders login button when no user', () => {
    const wrapper = mount(UserButton, {
      global: {
        stubs: {
          Button: {
            template: '<button><slot /></button>',
          },
          DropdownMenu: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Login')
  })

  it('login button has correct link', () => {
    const wrapper = mount(UserButton, {
      global: {
        stubs: {
          Button: {
            template: '<a :href="$attrs.href"><slot /></a>',
          },
          DropdownMenu: true,
        },
      },
    })

    expect(wrapper.html()).toContain('/auth/login')
  })

  it('renders dropdown menu when user is logged in', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div class="dropdown-menu"><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div class="menu-label"><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div class="menu-item"><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)
  })

  it('displays user email in dropdown', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('test@example.com')
  })

  it('shows admin panel link for admin users', () => {
    const adminUser = {
      ...mockUser,
      isAdmin: true,
    }

    const wrapper = mount(UserButton, {
      props: {
        user: adminUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Admin Panel')
  })

  it('does not show admin panel link for non-admin users', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).not.toContain('Admin Panel')
  })

  it('displays unread messages count badge', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
        unreadMessagesCount: 5,
      },
      global: {
        stubs: {
          Button: {
            template: '<button class="relative"><slot /></button>',
          },
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('5')
  })

  it('displays 99+ for messages count over 99', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
        unreadMessagesCount: 150,
      },
      global: {
        stubs: {
          Button: {
            template: '<button class="relative"><slot /></button>',
          },
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('99+')
  })

  it('shows My deals menu item', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('My deals')
  })

  it('shows Chat menu item', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Chat')
  })

  it('shows Logout menu item', () => {
    const wrapper = mount(UserButton, {
      props: {
        user: mockUser,
      },
      global: {
        stubs: {
          Button: true,
          DropdownMenu: {
            template: '<div><slot /></div>',
          },
          DropdownMenuTrigger: {
            template: '<div><slot /></div>',
          },
          DropdownMenuContent: {
            template: '<div><slot /></div>',
          },
          DropdownMenuLabel: {
            template: '<div><slot /></div>',
          },
          DropdownMenuSeparator: true,
          DropdownMenuItem: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Logout')
  })
})
