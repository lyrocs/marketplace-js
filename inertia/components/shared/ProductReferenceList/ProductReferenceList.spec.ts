import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductReferenceList from './ProductReferenceList.vue'

describe('ProductReferenceList', () => {
  it('renders with default title and subtitle', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [],
      },
    })

    expect(wrapper.find('.product-ref-title').text()).toBe('Produit(s) de référence du catalogue')
    expect(wrapper.find('.product-ref-subtitle').text()).toBe('Cette annonce est composée des produits officiels suivants.')
  })

  it('renders with custom title and subtitle', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [],
        title: 'Featured Products',
        subtitle: 'Check out these items',
      },
    })

    expect(wrapper.find('.product-ref-title').text()).toBe('Featured Products')
    expect(wrapper.find('.product-ref-subtitle').text()).toBe('Check out these items')
  })

  it('renders empty list when no products', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [],
      },
    })

    expect(wrapper.findAll('.product-ref-item').length).toBe(0)
  })

  it('renders single product', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'DJI Mavic',
            brand: 'DJI',
            images: ['image.jpg'],
          },
        ],
      },
    })

    expect(wrapper.findAll('.product-ref-item').length).toBe(1)
    expect(wrapper.text()).toContain('DJI Mavic')
    expect(wrapper.text()).toContain('DJI')
  })

  it('renders multiple products', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          { id: 1, name: 'Product 1', images: ['img1.jpg'] },
          { id: 2, name: 'Product 2', images: ['img2.jpg'] },
          { id: 3, name: 'Product 3', images: ['img3.jpg'] },
        ],
      },
    })

    expect(wrapper.findAll('.product-ref-item').length).toBe(3)
  })

  it('renders product with image', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test Product',
            images: ['test-image.jpg'],
          },
        ],
      },
    })

    const img = wrapper.find('.product-ref-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('test-image.jpg')
    expect(img.attributes('alt')).toBe('Test Product')
  })

  it('does not render image when no images', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test Product',
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-image').exists()).toBe(false)
  })

  it('renders product brand when provided', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Mavic Pro',
            brand: 'DJI',
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-brand').exists()).toBe(true)
    expect(wrapper.find('.product-ref-brand').text()).toBe('DJI')
  })

  it('does not render brand when not provided', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test Product',
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-brand').exists()).toBe(false)
  })

  it('renders product description when provided', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test Product',
            description: 'This is a test description',
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-description').exists()).toBe(true)
    expect(wrapper.find('.product-ref-description').text()).toBe('This is a test description')
  })

  it('does not render description when not provided', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test Product',
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-description').exists()).toBe(false)
  })

  it('renders link for each product', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' },
        ],
      },
    })

    const links = wrapper.findAll('.product-ref-link')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe('#')
    expect(links[0].attributes('title')).toBe('Voir la fiche officielle')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ProductReferenceList, {
      props: {
        products: [
          {
            id: 1,
            name: 'Test',
            brand: 'Brand',
            description: 'Desc',
            images: ['img.jpg'],
          },
        ],
      },
    })

    expect(wrapper.find('.product-ref-card').exists()).toBe(true)
    expect(wrapper.find('.product-ref-title').exists()).toBe(true)
    expect(wrapper.find('.product-ref-subtitle').exists()).toBe(true)
    expect(wrapper.find('.product-ref-list').exists()).toBe(true)
    expect(wrapper.find('.product-ref-item').exists()).toBe(true)
    expect(wrapper.find('.product-ref-image').exists()).toBe(true)
    expect(wrapper.find('.product-ref-info').exists()).toBe(true)
    expect(wrapper.find('.product-ref-brand').exists()).toBe(true)
    expect(wrapper.find('.product-ref-name').exists()).toBe(true)
    expect(wrapper.find('.product-ref-description').exists()).toBe(true)
    expect(wrapper.find('.product-ref-link').exists()).toBe(true)
  })
})
