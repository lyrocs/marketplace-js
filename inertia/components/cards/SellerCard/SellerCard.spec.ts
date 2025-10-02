import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SellerCard from './SellerCard.vue'

describe('SellerCard', () => {
  const mockSeller = {
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    location: 'Paris',
    shippingMethods: ['Remise en main propre', 'Envoi postal'],
  }

  it('renders seller name', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders seller avatar', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    const avatar = wrapper.find('.seller-avatar')
    expect(avatar.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('renders seller location', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Situé à Paris')
  })

  it('renders all shipping methods', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Remise en main propre')
    expect(wrapper.text()).toContain('Envoi postal')
  })

  it('renders rating slot', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      slots: {
        rating: '<div class="test-rating">5 stars</div>',
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    expect(wrapper.find('.test-rating').exists()).toBe(true)
    expect(wrapper.text()).toContain('5 stars')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    expect(wrapper.find('.seller-card').exists()).toBe(true)
    expect(wrapper.find('.seller-card-title').exists()).toBe(true)
    expect(wrapper.find('.seller-info').exists()).toBe(true)
    expect(wrapper.find('.seller-details').exists()).toBe(true)
  })

  it('renders correct number of shipping method items', () => {
    const wrapper = mount(SellerCard, {
      props: {
        seller: mockSeller,
      },
      global: {
        stubs: {
          IconLocationOnOutline: true,
          IconHandshakeOutline: true,
        },
      },
    })

    const detailItems = wrapper.findAll('.seller-detail-item')
    // 1 for location + 2 for shipping methods = 3 total
    expect(detailItems.length).toBe(3)
  })
})
