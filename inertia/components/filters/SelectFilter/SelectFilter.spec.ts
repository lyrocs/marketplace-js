import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectFilter from './SelectFilter.vue'

// Mock the UI components
vi.mock('~/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.join(' ')),
}))

describe('SelectFilter', () => {
  const mockSpecs = [
    { id: 1, value: 'Red', label: 'Red' },
    { id: 2, value: 'Blue', label: 'Blue' },
    { id: 3, value: 'Green', label: 'Green' },
  ]

  it('renders with specs', () => {
    const wrapper = mount(SelectFilter, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        type: 'color',
      },
      global: {
        stubs: {
          Combobox: true,
          ComboboxAnchor: true,
          ComboboxTrigger: true,
          Button: true,
          ComboboxList: true,
          ComboboxInput: true,
          ComboboxEmpty: true,
          ComboboxGroup: true,
          ComboboxItem: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('computes selected specs correctly', () => {
    const wrapper = mount(SelectFilter, {
      props: {
        specs: mockSpecs,
        selectedIds: [1, 3],
        type: 'color',
      },
      global: {
        stubs: {
          Combobox: true,
          ComboboxAnchor: true,
          ComboboxTrigger: true,
          Button: true,
          ComboboxList: true,
          ComboboxInput: true,
          ComboboxEmpty: true,
          ComboboxGroup: true,
          ComboboxItem: true,
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.selectedSpecs).toHaveLength(2)
    expect(vm.selectedSpecs[0].id).toBe(1)
    expect(vm.selectedSpecs[1].id).toBe(3)
  })

  it('emits add event when selecting unselected spec', async () => {
    const wrapper = mount(SelectFilter, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        type: 'color',
      },
      global: {
        stubs: {
          Combobox: true,
          ComboboxAnchor: true,
          ComboboxTrigger: true,
          Button: true,
          ComboboxList: true,
          ComboboxInput: true,
          ComboboxEmpty: true,
          ComboboxGroup: true,
          ComboboxItem: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.handleClick(1)

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual([1])
  })

  it('emits remove event when deselecting selected spec', async () => {
    const wrapper = mount(SelectFilter, {
      props: {
        specs: mockSpecs,
        selectedIds: [1],
        type: 'color',
      },
      global: {
        stubs: {
          Combobox: true,
          ComboboxAnchor: true,
          ComboboxTrigger: true,
          Button: true,
          ComboboxList: true,
          ComboboxInput: true,
          ComboboxEmpty: true,
          ComboboxGroup: true,
          ComboboxItem: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.handleClick(1)

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual([1])
  })

  it('applies inline class when inline prop is true', () => {
    const wrapper = mount(SelectFilter, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        type: 'color',
        inline: true,
      },
      global: {
        stubs: {
          Combobox: true,
          ComboboxAnchor: true,
          ComboboxTrigger: true,
          Button: true,
          ComboboxList: true,
          ComboboxInput: true,
          ComboboxEmpty: true,
          ComboboxGroup: true,
          ComboboxItem: true,
        },
      },
    })

    expect(wrapper.find('div').classes()).toContain('flex')
    expect(wrapper.find('div').classes()).toContain('gap-2')
  })
})
