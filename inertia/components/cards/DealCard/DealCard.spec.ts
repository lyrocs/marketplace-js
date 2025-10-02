import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DealCard from './DealCard.vue'

describe('DealCard', () => {
  const mockDeal = {
    id: 1,
    title: 'Test Deal',
    description: 'Test description',
    location: 'Paris',
    price: 199.99,
    currency: 'EUR',
    products: [
      {
        id: 1,
        name: 'Product 1',
        quantity: 2,
        images: ['https://example.com/image1.jpg'],
      },
      {
        id: 2,
        name: 'Product 2',
        quantity: 1,
        images: [],
      },
    ],
  }

  it('renders deal title', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('Test Deal')
  })

  it('renders deal description', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('Test description')
  })

  it('renders deal location', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('Paris')
  })

  it('renders price with EUR symbol', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('199.99 €')
  })

  it('renders price with USD symbol', () => {
    const usdDeal = {
      ...mockDeal,
      currency: 'USD',
    }

    const wrapper = mount(DealCard, {
      props: {
        deal: usdDeal,
      },
    })

    expect(wrapper.text()).toContain('$')
  })

  it('renders first product image', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image1.jpg')
  })

  it('renders placeholder image when no product images', () => {
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

    const wrapper = mount(DealCard, {
      props: {
        deal: dealWithoutImages,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('placehold.co')
  })

  it('renders all products in list', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('2x Product 1')
    expect(wrapper.text()).toContain('1x Product 2')
  })

  it('has correct deal link', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/deals/1')
  })

  it('applies hover classes', () => {
    const wrapper = mount(DealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const card = wrapper.find('a')
    expect(card.classes()).toContain('group')
    expect(card.classes()).toContain('hover:shadow-xl')
  })
})
