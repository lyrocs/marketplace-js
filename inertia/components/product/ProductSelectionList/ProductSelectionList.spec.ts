import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductSelectionList from './ProductSelectionList.vue'

describe('ProductSelectionList', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      images: ['https://example.com/image1.jpg'],
      category: {
        id: 1,
        name: 'Electronics',
      },
      brand: {
        id: 1,
        name: 'Brand A',
      },
      specs: [
        {
          id: 1,
          value: 'Red',
          type: {
            id: 1,
            label: 'Color',
          },
        },
        {
          id: 2,
          value: '128GB',
          type: {
            id: 2,
            label: 'Storage',
          },
        },
      ],
    },
    {
      id: 2,
      name: 'Product 2',
      images: ['https://example.com/image2.jpg'],
      category: {
        id: 2,
        name: 'Accessories',
      },
      brand: null,
      specs: [
        {
          id: 3,
          value: 'Blue',
          type: {
            id: 1,
            label: 'Color',
          },
        },
        {
          id: 4,
          value: 'Small',
          type: {
            id: 3,
            label: 'Size',
          },
        },
        {
          id: 5,
          value: 'Leather',
          type: {
            id: 4,
            label: 'Material',
          },
        },
        {
          id: 6,
          value: 'Premium',
          type: {
            id: 5,
            label: 'Quality',
          },
        },
      ],
    },
  ]

  it('renders list of products', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const grid = wrapper.find('ul.grid')
    const productItems = grid.findAll('li.border')
    expect(productItems).toHaveLength(2)
  })

  it('renders product names', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
  })

  it('renders product images', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const images = wrapper.findAll('img')
    expect(images[0].attributes('src')).toBe('https://example.com/image1.jpg')
    expect(images[1].attributes('src')).toBe('https://example.com/image2.jpg')
  })

  it('renders category and brand information', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    expect(wrapper.text()).toContain('Electronics - Brand A')
    expect(wrapper.text()).toContain('Accessories - No brand')
  })

  it('displays "No brand" when brand is null', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    expect(wrapper.text()).toContain('No brand')
  })

  it('renders first 3 specs for each product', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    expect(wrapper.text()).toContain('Color: Red')
    expect(wrapper.text()).toContain('Storage: 128GB')
    expect(wrapper.text()).toContain('Color: Blue')
    expect(wrapper.text()).toContain('Size: Small')
    expect(wrapper.text()).toContain('Material: Leather')
  })

  it('shows additional specs count when more than 3', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    expect(wrapper.text()).toContain('+1 more')
  })

  it('does not show additional count when 3 or fewer specs', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: [mockProducts[0]],
      },
    })

    expect(wrapper.text()).not.toContain('more')
  })

  it('renders select button for each product', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Select')
    expect(buttons[1].text()).toBe('Select')
  })

  it('emits select event when button is clicked', async () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockProducts[0]])
  })

  it('updates button text to "Selected" when product is selected', async () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(buttons[0].text()).toBe('Selected')
    expect(buttons[1].text()).toBe('Select')
  })

  it('applies active styling to selected product button', async () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(buttons[0].classes()).toContain('bg-blue-700')
  })

  it('changes selection when different product is clicked', async () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    expect(buttons[0].text()).toBe('Selected')
    expect(buttons[1].text()).toBe('Select')

    await buttons[1].trigger('click')
    expect(buttons[0].text()).toBe('Select')
    expect(buttons[1].text()).toBe('Selected')
  })

  it('emits select event multiple times for different products', async () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('select')).toHaveLength(2)
    expect(wrapper.emitted('select')?.[0]).toEqual([mockProducts[0]])
    expect(wrapper.emitted('select')?.[1]).toEqual([mockProducts[1]])
  })

  it('renders empty list when no products provided', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: [],
      },
    })

    const productItems = wrapper.findAll('li')
    expect(productItems).toHaveLength(0)
  })

  it('applies hover effect styling to product cards', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const productItems = wrapper.findAll('li')
    expect(productItems[0].classes()).toContain('hover:shadow-md')
    expect(productItems[0].classes()).toContain('transition-shadow')
  })

  it('renders responsive grid layout', () => {
    const wrapper = mount(ProductSelectionList, {
      props: {
        products: mockProducts,
      },
    })

    const grid = wrapper.find('ul')
    expect(grid.classes()).toContain('grid')
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-2')
    expect(grid.classes()).toContain('lg:grid-cols-3')
    expect(grid.classes()).toContain('2xl:grid-cols-4')
  })
})
