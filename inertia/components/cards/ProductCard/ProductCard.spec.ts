import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    images: ['https://example.com/image.jpg'],
    specs: [
      { id: 1, value: 'Red' },
      { id: 2, value: 'Large' },
    ],
    shops: [
      {
        id: 1,
        price: 99.99,
        currency: 'EUR',
        available: true,
      },
    ],
  }

  it('renders product name', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Product')
  })

  it('renders product image', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    const img = wrapper.find('img[alt="Product image"]')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('renders placeholder image when no images', () => {
    const productWithoutImage = {
      ...mockProduct,
      images: null,
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: productWithoutImage,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    const img = wrapper.find('img[alt="Product image"]')
    expect(img.attributes('src')).toContain('placehold.co')
  })

  it('renders product specs', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Red')
    expect(wrapper.text()).toContain('Large')
  })

  it('renders shop availability', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Disponible')
  })

  it('renders unavailable when shop is not available', () => {
    const unavailableProduct = {
      ...mockProduct,
      shops: [{ ...mockProduct.shops[0], available: false }],
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: unavailableProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Non disponible')
  })

  it('renders price with EUR symbol', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('99.99 €')
  })

  it('renders price with USD symbol', () => {
    const usdProduct = {
      ...mockProduct,
      shops: [{ ...mockProduct.shops[0], currency: 'USD' }],
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: usdProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    expect(wrapper.text()).toContain('$')
  })

  it('has correct product link', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/product/1')
  })
})
