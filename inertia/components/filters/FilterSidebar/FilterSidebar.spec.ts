import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterSidebar from './FilterSidebar.vue'

describe('FilterSidebar', () => {
  const mockSpecs = [
    {
      id: 1,
      label: 'Spec 1',
      type: {
        id: 1,
        label: 'Type 1',
      },
    },
    {
      id: 2,
      label: 'Spec 2',
      type: {
        id: 1,
        label: 'Type 1',
      },
    },
  ]

  it('renders filter sidebar with title', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Filter Options')
  })

  it('applies correct CSS classes to container', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: true,
        },
      },
    })

    const container = wrapper.find('.filter-sidebar')
    expect(container.exists()).toBe(true)
  })

  it('renders Filters component', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: {
            template: '<div class="filters"></div>',
          },
        },
      },
    })

    expect(wrapper.find('.filters').exists()).toBe(true)
  })

  it('renders with specs prop', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with selectedIds prop', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [1, 2],
      },
      global: {
        stubs: {
          Filters: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('handles Filters component events', async () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'Filter Options',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: {
            template: '<div class="filters" @click="$emit(\'change\', [1, 2])"></div>',
          },
        },
      },
    })

    const filters = wrapper.find('.filters')
    await filters.trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([[1, 2]])
  })

  it('renders title with correct styling', () => {
    const wrapper = mount(FilterSidebar, {
      props: {
        title: 'My Filters',
        specs: mockSpecs,
        selectedIds: [],
      },
      global: {
        stubs: {
          Filters: true,
        },
      },
    })

    const title = wrapper.find('.filter-sidebar-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('My Filters')
  })
})
