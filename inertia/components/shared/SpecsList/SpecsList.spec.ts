import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SpecsList from './SpecsList.vue'

describe('SpecsList', () => {
  it('renders with default title', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [],
      },
    })

    expect(wrapper.find('.specs-title').text()).toBe('Caractéristiques clés')
  })

  it('renders with custom title', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [],
        title: 'Technical Specifications',
      },
    })

    expect(wrapper.find('.specs-title').text()).toBe('Technical Specifications')
  })

  it('renders empty list when no specs provided', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [],
      },
    })

    expect(wrapper.findAll('.spec-item').length).toBe(0)
  })

  it('renders single spec', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [{ label: 'Weight', value: '500g' }],
      },
    })

    expect(wrapper.findAll('.spec-item').length).toBe(1)
    expect(wrapper.text()).toContain('Weight')
    expect(wrapper.text()).toContain('500g')
  })

  it('renders multiple specs', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [
          { label: 'Weight', value: '500g' },
          { label: 'Range', value: '10km' },
          { label: 'Battery', value: '5000mAh' },
        ],
      },
    })

    expect(wrapper.findAll('.spec-item').length).toBe(3)
    expect(wrapper.text()).toContain('Weight')
    expect(wrapper.text()).toContain('500g')
    expect(wrapper.text()).toContain('Range')
    expect(wrapper.text()).toContain('10km')
    expect(wrapper.text()).toContain('Battery')
    expect(wrapper.text()).toContain('5000mAh')
  })

  it('renders spec labels correctly', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [
          { label: 'Flight Time', value: '30 min' },
          { label: 'Sensor', value: '48MP' },
        ],
      },
    })

    const labels = wrapper.findAll('.spec-label')
    expect(labels.length).toBe(2)
    expect(labels[0].text()).toBe('Flight Time')
    expect(labels[1].text()).toBe('Sensor')
  })

  it('renders spec values correctly', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [
          { label: 'Flight Time', value: '30 min' },
          { label: 'Sensor', value: '48MP' },
        ],
      },
    })

    const values = wrapper.findAll('.spec-value')
    expect(values.length).toBe(2)
    expect(values[0].text()).toBe('30 min')
    expect(values[1].text()).toBe('48MP')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SpecsList, {
      props: {
        specs: [{ label: 'Test', value: 'Value' }],
      },
    })

    expect(wrapper.find('.specs-card').exists()).toBe(true)
    expect(wrapper.find('.specs-title').exists()).toBe(true)
    expect(wrapper.find('.specs-grid').exists()).toBe(true)
    expect(wrapper.find('.spec-item').exists()).toBe(true)
    expect(wrapper.find('.spec-label').exists()).toBe(true)
    expect(wrapper.find('.spec-value').exists()).toBe(true)
  })
})
