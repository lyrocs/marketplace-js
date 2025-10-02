import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewModeToggle from './ViewModeToggle.vue'

describe('ViewModeToggle', () => {
  it('renders with grid mode selected', () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('view-toggle-active')
    expect(buttons[1].classes()).toContain('view-toggle-inactive')
  })

  it('renders with list mode selected', () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'list',
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('view-toggle-inactive')
    expect(buttons[1].classes()).toContain('view-toggle-active')
  })

  it('emits update:modelValue with grid when grid button clicked', async () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'list',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['grid'])
  })

  it('emits update:modelValue with list when list button clicked', async () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['list'])
  })

  it('has correct title attributes', () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('title')).toBe('Vue grille')
    expect(buttons[1].attributes('title')).toBe('Vue liste')
  })

  it('renders svg icons', () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBe(2)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ViewModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    expect(wrapper.find('.view-toggle').exists()).toBe(true)
    expect(wrapper.findAll('.view-toggle-button').length).toBe(2)
  })
})
