import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShopList from './ShopList.vue'

describe('ShopList', () => {
  const mockShops = [
    {
      id: 1,
      name: 'Amazon',
      url: 'https://amazon.com/product',
      price: 99.99,
      currency: 'EUR',
      available: true,
    },
    {
      id: 2,
      name: 'eBay',
      url: 'https://ebay.com/item',
      price: 89.99,
      currency: 'USD',
      available: false,
    },
    {
      id: 3,
      name: 'BestBuy',
      url: 'https://bestbuy.com/product',
      price: 129.99,
      currency: 'EUR',
      available: true,
    },
  ]

  it('renders default title', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    expect(wrapper.find('.shop-list-title').text()).toBe('Shop disponible')
  })

  it('renders custom title', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
        title: 'Available Stores',
      },
    })

    expect(wrapper.find('.shop-list-title').text()).toBe('Available Stores')
  })

  it('renders all shops', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const shopItems = wrapper.findAll('.shop-item')
    expect(shopItems).toHaveLength(3)
  })

  it('renders shop names', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    expect(wrapper.text()).toContain('Amazon')
    expect(wrapper.text()).toContain('eBay')
    expect(wrapper.text()).toContain('BestBuy')
  })

  it('renders shop URLs as links', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const links = wrapper.findAll('.shop-item')
    expect(links[0].attributes('href')).toBe('https://amazon.com/product')
    expect(links[1].attributes('href')).toBe('https://ebay.com/item')
    expect(links[2].attributes('href')).toBe('https://bestbuy.com/product')
  })

  it('renders prices with EUR symbol', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[0]],
      },
    })

    expect(wrapper.find('.shop-price').text()).toBe('99.99 €')
  })

  it('renders prices with USD symbol', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[1]],
      },
    })

    expect(wrapper.find('.shop-price').text()).toBe('89.99 $')
  })

  it('displays "Disponible" for available shops', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[0]],
      },
    })

    const availability = wrapper.find('.shop-availability')
    expect(availability.text()).toBe('Disponible')
    expect(availability.classes()).toContain('shop-available')
  })

  it('displays "Non disponible" for unavailable shops', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[1]],
      },
    })

    const availability = wrapper.find('.shop-availability')
    expect(availability.text()).toBe('Non disponible')
    expect(availability.classes()).toContain('shop-unavailable')
  })

  it('applies correct availability class for available shops', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const availabilities = wrapper.findAll('.shop-availability')
    expect(availabilities[0].classes()).toContain('shop-available')
    expect(availabilities[1].classes()).toContain('shop-unavailable')
    expect(availabilities[2].classes()).toContain('shop-available')
  })

  it('renders external link icon for each shop', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const icons = wrapper.findAll('i.ri-external-link-line')
    expect(icons).toHaveLength(3)
  })

  it('renders empty shop list when no shops provided', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [],
      },
    })

    const shopItems = wrapper.findAll('.shop-item')
    expect(shopItems).toHaveLength(0)
    expect(wrapper.find('.shop-list-title').exists()).toBe(true)
  })

  it('renders single shop correctly', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[0]],
      },
    })

    const shopItems = wrapper.findAll('.shop-item')
    expect(shopItems).toHaveLength(1)
    expect(wrapper.text()).toContain('Amazon')
    expect(wrapper.text()).toContain('99.99 €')
    expect(wrapper.text()).toContain('Disponible')
  })

  it('applies correct CSS classes to container', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const container = wrapper.find('.shop-list-container')
    expect(container.exists()).toBe(true)
  })

  it('applies correct CSS classes to shop list', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const list = wrapper.find('.shop-list')
    expect(list.exists()).toBe(true)
  })

  it('each shop item is a clickable link', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const shopItems = wrapper.findAll('.shop-item')
    shopItems.forEach((item) => {
      expect(item.element.tagName).toBe('A')
    })
  })

  it('renders shop name with correct class', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[0]],
      },
    })

    const shopName = wrapper.find('.shop-name')
    expect(shopName.exists()).toBe(true)
    expect(shopName.text()).toBe('Amazon')
  })

  it('renders price in price container', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: [mockShops[0]],
      },
    })

    const priceContainer = wrapper.find('.shop-price-container')
    const price = priceContainer.find('.shop-price')
    expect(priceContainer.exists()).toBe(true)
    expect(price.exists()).toBe(true)
    expect(price.text()).toBe('99.99 €')
  })

  it('handles different currency formats', () => {
    const wrapper = mount(ShopList, {
      props: {
        shops: mockShops,
      },
    })

    const prices = wrapper.findAll('.shop-price')
    expect(prices[0].text()).toBe('99.99 €')
    expect(prices[1].text()).toBe('89.99 $')
    expect(prices[2].text()).toBe('129.99 €')
  })
})
