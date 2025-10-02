import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductBreadcrumb from './ProductBreadcrumb.vue'

describe('ProductBreadcrumb', () => {
  it('renders breadcrumb text', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home > Electronics',
        title: 'Laptop',
      },
    })

    expect(wrapper.text()).toContain('Home > Electronics')
  })

  it('renders product title', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home > Electronics',
        title: 'Laptop',
      },
    })

    expect(wrapper.text()).toContain('Laptop')
  })

  it('applies correct styling to breadcrumb', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home > Electronics',
        title: 'Laptop',
      },
    })

    const breadcrumb = wrapper.find('.breadcrumb')
    expect(breadcrumb.exists()).toBe(true)
    expect(breadcrumb.text()).toBe('Home > Electronics')
  })

  it('applies correct styling to title', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home > Electronics',
        title: 'Laptop',
      },
    })

    const title = wrapper.find('.product-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Laptop')
  })

  it('renders with different breadcrumb values', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Accueil > Vêtements > Homme',
        title: 'T-shirt',
      },
    })

    expect(wrapper.find('.breadcrumb').text()).toBe('Accueil > Vêtements > Homme')
    expect(wrapper.find('.product-title').text()).toBe('T-shirt')
  })

  it('renders with long title', () => {
    const longTitle = 'This is a very long product title that should still render correctly'
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home',
        title: longTitle,
      },
    })

    expect(wrapper.find('.product-title').text()).toBe(longTitle)
  })

  it('renders container div', () => {
    const wrapper = mount(ProductBreadcrumb, {
      props: {
        breadcrumb: 'Home',
        title: 'Product',
      },
    })

    expect(wrapper.find('div').exists()).toBe(true)
  })
})
