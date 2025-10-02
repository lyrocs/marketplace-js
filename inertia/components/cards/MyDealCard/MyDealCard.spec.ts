import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyDealCard from './MyDealCard.vue'

describe('MyDealCard', () => {
  const mockDeal = {
    id: 1,
    title: 'My Deal',
    description: 'Test description',
    location: 'Lyon',
    price: 150.0,
    currency: 'EUR',
    status: 'active',
    createdAt: '2025-01-15T10:00:00.000Z',
    products: [
      {
        id: 1,
        name: 'Product 1',
        quantity: 2,
        images: ['https://example.com/image.jpg'],
      },
      {
        id: 2,
        name: 'Product 2',
        quantity: 3,
        images: [],
      },
    ],
    discussions: [],
  }

  it('renders deal title', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('My Deal')
  })

  it('renders deal price with EUR symbol', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('150 €')
  })

  it('renders price with USD symbol', () => {
    const usdDeal = {
      ...mockDeal,
      currency: 'USD',
    }

    const wrapper = mount(MyDealCard, {
      props: {
        deal: usdDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('$')
  })

  it('renders deal location', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Lyon')
  })

  it('renders default location when not specified', () => {
    const dealWithoutLocation = {
      ...mockDeal,
      location: undefined,
    }

    const wrapper = mount(MyDealCard, {
      props: {
        deal: dealWithoutLocation,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Non spécifié')
  })

  it('renders deal status', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: {
            template: '<span class="badge"><slot /></span>',
          },
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('active')
  })

  it('computes correct status variant for active status', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: { ...mockDeal, status: 'published' },
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.statusVariant).toBe('default')
  })

  it('computes correct status variant for pending status', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: { ...mockDeal, status: 'pending' },
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.statusVariant).toBe('secondary')
  })

  it('computes correct status variant for cancelled status', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: { ...mockDeal, status: 'cancelled' },
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.statusVariant).toBe('destructive')
  })

  it('renders first product image', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('renders placeholder when no product images', () => {
    const dealWithoutImages = {
      ...mockDeal,
      products: [
        {
          id: 1,
          name: 'Product',
          quantity: 1,
          images: [],
        },
      ],
    }

    const wrapper = mount(MyDealCard, {
      props: {
        deal: dealWithoutImages,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('placehold.co')
  })

  it('computes total products correctly', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.totalProducts).toBe(5)
  })

  it('formats date correctly', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.formatDate(mockDeal.createdAt)).toBe('15/01/2025')
  })

  it('computes message count correctly', () => {
    const dealWithDiscussions = {
      ...mockDeal,
      discussions: [{ id: 1 }, { id: 2 }],
    }

    const wrapper = mount(MyDealCard, {
      props: {
        deal: dealWithDiscussions,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.messageCount).toBe(2)
  })

  it('renders message badge when discussions exist', () => {
    const dealWithDiscussions = {
      ...mockDeal,
      discussions: [{ id: 1 }],
    }

    const wrapper = mount(MyDealCard, {
      props: {
        deal: dealWithDiscussions,
      },
      global: {
        stubs: {
          Badge: {
            template: '<span class="badge"><slot /></span>',
          },
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('1 message')
  })

  it('has correct view link', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.html()).toContain('/deals/1')
  })

  it('has correct edit link', () => {
    const wrapper = mount(MyDealCard, {
      props: {
        deal: mockDeal,
      },
      global: {
        stubs: {
          Badge: true,
          Button: true,
        },
      },
    })

    expect(wrapper.html()).toContain('/deals/1/edit')
  })
})
