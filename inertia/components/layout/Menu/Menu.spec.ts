import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from './Menu.vue'

vi.mock('~/composables/useMenu', () => ({
  useMenu: vi.fn(() => ({
    menuParentCategories: [
      {
        title: 'Electronics',
        children: [
          {
            title: 'Laptops',
            href: '/category/laptops',
            image: '/images/laptop.png',
            description: 'Browse laptops and notebooks',
          },
          {
            title: 'Phones',
            href: '/category/phones',
            image: '/images/phone.png',
            description: 'Browse smartphones',
          },
        ],
      },
      {
        title: 'Clothing',
        children: [
          {
            title: 'Men',
            href: '/category/men',
            image: '/images/men.png',
            description: 'Men clothing',
          },
        ],
      },
    ],
  })),
}))

describe('Menu', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
    },
  ]

  it('renders navigation menu', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div class="navigation-menu"><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div class="menu-content"><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('.navigation-menu').exists()).toBe(true)
  })

  it('renders parent categories', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('Clothing')
  })

  it('renders child categories', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Laptops')
    expect(wrapper.text()).toContain('Phones')
    expect(wrapper.text()).toContain('Men')
  })

  it('renders category descriptions', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Browse laptops and notebooks')
    expect(wrapper.text()).toContain('Browse smartphones')
  })

  it('renders category links with correct href', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const links = wrapper.findAll('a')
    expect(links[0].attributes('href')).toBe('/category/laptops')
    expect(links[1].attributes('href')).toBe('/category/phones')
  })

  it('renders category images', () => {
    const wrapper = mount(Menu, {
      props: {
        categories: mockCategories,
      },
      global: {
        stubs: {
          NavigationMenu: {
            template: '<div><slot /></div>',
          },
          NavigationMenuList: {
            template: '<ul><slot /></ul>',
          },
          NavigationMenuItem: {
            template: '<li><slot /></li>',
          },
          NavigationMenuTrigger: {
            template: '<button><slot /></button>',
          },
          NavigationMenuContent: {
            template: '<div><slot /></div>',
          },
          NavigationMenuLink: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThan(0)
    expect(images[0].attributes('src')).toBe('/images/laptop.png')
  })
})
