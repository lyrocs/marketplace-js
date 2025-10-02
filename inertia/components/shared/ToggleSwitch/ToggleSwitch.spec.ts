import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleSwitch from './ToggleSwitch.vue'

describe('ToggleSwitch', () => {
  it('renders with left and right labels', () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: true,
      },
    })

    expect(wrapper.text()).toContain('Grid')
    expect(wrapper.text()).toContain('List')
  })

  it('applies active class to left button when isLeftActive is true', () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: true,
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('toggle-button-active')
    expect(buttons[1].classes()).toContain('toggle-button-inactive')
  })

  it('applies active class to right button when isLeftActive is false', () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: false,
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('toggle-button-inactive')
    expect(buttons[1].classes()).toContain('toggle-button-active')
  })

  it('emits clickLeft when left button is clicked', async () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: false,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('clickLeft')).toBeTruthy()
    expect(wrapper.emitted('clickLeft')?.length).toBe(1)
  })

  it('emits clickRight when right button is clicked', async () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: true,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('clickRight')).toBeTruthy()
    expect(wrapper.emitted('clickRight')?.length).toBe(1)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        leftLabel: 'Grid',
        rightLabel: 'List',
        isLeftActive: true,
      },
    })

    expect(wrapper.find('.toggle-wrapper').exists()).toBe(true)
    expect(wrapper.find('.toggle-container').exists()).toBe(true)
    expect(wrapper.findAll('.toggle-button').length).toBe(2)
  })
})
