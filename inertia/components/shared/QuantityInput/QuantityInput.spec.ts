import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('QuantityInput', () => {
  it('renders with default props', () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
      },
    })

    const input = wrapper.find('input[type="number"]')
    expect(input.element.value).toBe('1')
  })

  it('renders with custom min value', () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 5,
      },
    })

    const input = wrapper.find('input[type="number"]')
    expect(input.element.value).toBe('5')
    expect(input.attributes('min')).toBe('5')
  })

  it('emits update:modelValue when increase button is clicked', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
      },
    })

    const increaseButton = wrapper.findAll('button')[1]
    await increaseButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('emits update:modelValue when decrease button is clicked', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 1,
      },
    })

    const decreaseButton = wrapper.findAll('button')[0]
    await decreaseButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('does not decrease below min value', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
        min: 1,
      },
    })

    const decreaseButton = wrapper.findAll('button')[0]
    await decreaseButton.trigger('click')

    // When at min value, the decrease button is disabled, so no event is emitted
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('disables decrease button when at min value', () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
        min: 1,
      },
    })

    const decreaseButton = wrapper.findAll('button')[0]
    expect(decreaseButton.attributes('disabled')).toBeDefined()
  })

  it('does not disable decrease button when above min value', () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 1,
      },
    })

    const decreaseButton = wrapper.findAll('button')[0]
    expect(decreaseButton.attributes('disabled')).toBeUndefined()
  })

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('10')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('enforces min value when input is below minimum', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 3,
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('1')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('handles NaN input by setting to min value', async () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 1,
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(QuantityInput, {
      props: {
        modelValue: 1,
      },
    })

    expect(wrapper.find('.quantity-input').exists()).toBe(true)
    expect(wrapper.find('.quantity-button-left').exists()).toBe(true)
    expect(wrapper.find('.quantity-button-right').exists()).toBe(true)
    expect(wrapper.find('.quantity-value').exists()).toBe(true)
  })
})
