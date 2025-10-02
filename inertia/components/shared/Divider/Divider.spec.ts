import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'

describe('Divider', () => {
  it('renders with text', () => {
    const wrapper = mount(Divider, {
      props: {
        text: 'OR',
      },
    })

    expect(wrapper.text()).toBe('OR')
  })

  it('renders with custom text', () => {
    const wrapper = mount(Divider, {
      props: {
        text: 'Continue with',
      },
    })

    expect(wrapper.find('.divider-text').text()).toBe('Continue with')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(Divider, {
      props: {
        text: 'OR',
      },
    })

    expect(wrapper.find('.divider-wrapper').exists()).toBe(true)
    expect(wrapper.find('.divider-line').exists()).toBe(true)
    expect(wrapper.find('.divider-border').exists()).toBe(true)
    expect(wrapper.find('.divider-text-wrapper').exists()).toBe(true)
    expect(wrapper.find('.divider-text').exists()).toBe(true)
  })
})
