import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SellButton from './SellButton.vue'

describe('SellButton', () => {
  it('renders sell button by default', () => {
    const wrapper = mount(SellButton)

    expect(wrapper.text()).toContain('Vendre')
  })

  it('has correct link to create deal page', () => {
    const wrapper = mount(SellButton)

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/deals/create')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SellButton)

    const link = wrapper.find('a')
    expect(link.classes()).toContain('rounded-full')
    expect(link.classes()).toContain('bg-slate-700')
  })

  it('does not render when show is false', () => {
    const wrapper = mount(SellButton, {
      props: {
        show: false,
      },
    })

    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders when show is true', () => {
    const wrapper = mount(SellButton, {
      props: {
        show: true,
      },
    })

    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('has hover styles', () => {
    const wrapper = mount(SellButton)

    const link = wrapper.find('a')
    expect(link.attributes('class')).toContain('hover:bg-slate-800')
  })
})
