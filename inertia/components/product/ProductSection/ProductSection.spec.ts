import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductSection from './ProductSection.vue'

describe('ProductSection', () => {
  it('renders with title', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Product Details',
      },
    })

    expect(wrapper.find('.product-section-title').text()).toBe('Product Details')
  })

  it('renders slot content', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Section Title',
      },
      slots: {
        default: '<p>This is the content</p>',
      },
    })

    expect(wrapper.html()).toContain('<p>This is the content</p>')
  })

  it('renders multiple elements in slot', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Features',
      },
      slots: {
        default: `
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        `,
      },
    })

    expect(wrapper.text()).toContain('Feature 1')
    expect(wrapper.text()).toContain('Feature 2')
    expect(wrapper.text()).toContain('Feature 3')
  })

  it('applies correct CSS class to container', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Test Section',
      },
    })

    const container = wrapper.find('.product-section')
    expect(container.exists()).toBe(true)
  })

  it('applies correct CSS class to title', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Test Title',
      },
    })

    const title = wrapper.find('.product-section-title')
    expect(title.exists()).toBe(true)
    expect(title.element.tagName).toBe('H2')
  })

  it('renders empty slot when no content provided', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Empty Section',
      },
    })

    const section = wrapper.find('.product-section')
    const title = wrapper.find('.product-section-title')

    expect(section.exists()).toBe(true)
    expect(title.exists()).toBe(true)
    expect(wrapper.text()).toBe('Empty Section')
  })

  it('renders with different title values', () => {
    const titles = ['Description', 'Specifications', 'Reviews', 'Related Products']

    titles.forEach((title) => {
      const wrapper = mount(ProductSection, {
        props: {
          title,
        },
      })

      expect(wrapper.find('.product-section-title').text()).toBe(title)
    })
  })

  it('renders component structure correctly', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Product Info',
      },
      slots: {
        default: '<div class="content">Content here</div>',
      },
    })

    const section = wrapper.find('.product-section')
    const title = section.find('.product-section-title')
    const content = section.find('.content')

    expect(section.exists()).toBe(true)
    expect(title.exists()).toBe(true)
    expect(content.exists()).toBe(true)
  })

  it('allows complex nested content in slot', () => {
    const wrapper = mount(ProductSection, {
      props: {
        title: 'Product Specifications',
      },
      slots: {
        default: `
          <div class="specs">
            <div class="spec-item">
              <span class="label">Color:</span>
              <span class="value">Red</span>
            </div>
            <div class="spec-item">
              <span class="label">Size:</span>
              <span class="value">Large</span>
            </div>
          </div>
        `,
      },
    })

    expect(wrapper.find('.specs').exists()).toBe(true)
    expect(wrapper.findAll('.spec-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('Color:')
    expect(wrapper.text()).toContain('Red')
    expect(wrapper.text()).toContain('Size:')
    expect(wrapper.text()).toContain('Large')
  })
})
