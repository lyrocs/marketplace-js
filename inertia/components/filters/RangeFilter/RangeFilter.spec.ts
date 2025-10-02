import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeFilter from './RangeFilter.vue'

describe('RangeFilter', () => {
  it('renders correctly', () => {
    const wrapper = mount(RangeFilter, {
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders separator', () => {
    const wrapper = mount(RangeFilter, {
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.text()).toContain('-')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(RangeFilter, {
      global: {
        stubs: {
          Input: true,
        },
      },
    })

    expect(wrapper.find('div').classes()).toContain('flex')
    expect(wrapper.find('div').classes()).toContain('items-center')
    expect(wrapper.find('div').classes()).toContain('gap-2')
  })
})
