import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from './StatsCard.vue'

describe('StatsCard', () => {
  it('renders with label and value', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Total Sales',
        value: 150,
      },
    })

    expect(wrapper.text()).toContain('Total Sales')
    expect(wrapper.text()).toContain('150')
  })

  it('renders with string value', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Status',
        value: 'Active',
      },
    })

    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Active')
  })

  it('applies default icon color (blue)', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
      },
    })

    const icon = wrapper.find('.stats-card-icon')
    expect(icon.classes()).toContain('bg-blue-100')
    expect(icon.classes()).toContain('text-blue-600')
  })

  it('applies green icon color', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
        iconColor: 'green',
      },
    })

    const icon = wrapper.find('.stats-card-icon')
    expect(icon.classes()).toContain('bg-green-100')
    expect(icon.classes()).toContain('text-green-600')
  })

  it('applies yellow icon color', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
        iconColor: 'yellow',
      },
    })

    const icon = wrapper.find('.stats-card-icon')
    expect(icon.classes()).toContain('bg-yellow-100')
    expect(icon.classes()).toContain('text-yellow-600')
  })

  it('applies gray icon color', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
        iconColor: 'gray',
      },
    })

    const icon = wrapper.find('.stats-card-icon')
    expect(icon.classes()).toContain('bg-gray-100')
    expect(icon.classes()).toContain('text-gray-600')
  })

  it('applies default value color', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
      },
    })

    const value = wrapper.find('.stats-card-value')
    expect(value.classes()).toContain('text-gray-900')
  })

  it('applies custom value color', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
        valueColor: 'text-red-500',
      },
    })

    const value = wrapper.find('.stats-card-value')
    expect(value.classes()).toContain('text-red-500')
  })

  it('renders slot content in icon area', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
      },
      slots: {
        default: '<span class="test-icon">Icon</span>',
      },
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Icon')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(StatsCard, {
      props: {
        label: 'Test',
        value: 10,
      },
    })

    expect(wrapper.find('.stats-card').exists()).toBe(true)
    expect(wrapper.find('.stats-card-content').exists()).toBe(true)
    expect(wrapper.find('.stats-card-label').exists()).toBe(true)
    expect(wrapper.find('.stats-card-value').exists()).toBe(true)
    expect(wrapper.find('.stats-card-icon').exists()).toBe(true)
  })
})
