import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterCard from './FilterCard.vue'

describe('FilterCard', () => {
  it('renders with title', () => {
    const wrapper = mount(FilterCard, {
      props: {
        title: 'Price Range',
      },
    })

    expect(wrapper.find('h3').text()).toBe('Price Range')
  })

  it('renders slot content', () => {
    const wrapper = mount(FilterCard, {
      props: {
        title: 'Filters',
      },
      slots: {
        default: '<div class="test-content">Filter content</div>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Filter content')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(FilterCard, {
      props: {
        title: 'Test',
      },
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('rounded-xl')
    expect(container.classes()).toContain('bg-white')
    expect(container.classes()).toContain('p-6')
    expect(container.classes()).toContain('shadow-lg')
  })
})
