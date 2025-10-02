import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Filters from './Filters.vue'

describe('Filters', () => {
  const mockSpecs = [
    {
      id: 1,
      label: 'Spec 1',
      type: {
        id: 1,
        label: 'Type A',
      },
    },
    {
      id: 2,
      label: 'Spec 2',
      type: {
        id: 1,
        label: 'Type A',
      },
    },
    {
      id: 3,
      label: 'Spec 3',
      type: {
        id: 2,
        label: 'Type B',
      },
    },
  ]

  const mockCategories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
    },
    {
      id: 2,
      name: 'Clothing',
      slug: 'clothing',
    },
  ]

  const mockStatuses = ['active', 'pending', 'sold']

  it('groups specs by type', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: {
            template: '<div><slot /></div>',
          },
          SelectFilter: {
            template: '<div class="select-filter"></div>',
          },
          Button: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    const selectFilters = wrapper.findAll('.select-filter')
    expect(selectFilters.length).toBe(2) // Two types: Type A and Type B
  })

  it('renders reset button', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: true,
          Button: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Réinitialiser')
  })

  it('emits change event with empty array when reset is clicked', async () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [1, 2],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: true,
          Button: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([[]])
  })

  it('renders with categories', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: [],
        selectedIds: [],
        categories: mockCategories,
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          SelectFilter: true,
          Button: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders with statuses', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: [],
        selectedIds: [],
        categories: [],
        statuses: mockStatuses,
      },
      global: {
        stubs: {
          FilterCard: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          SelectFilter: true,
          Button: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('handles spec addition', async () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: {
            template: '<div class="select-filter" @click="$emit(\'add\', 1)"></div>',
          },
          Button: true,
        },
      },
    })

    const selectFilters = wrapper.findAll('.select-filter')
    if (selectFilters.length > 0) {
      await selectFilters[0].trigger('click')

      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')?.[0]).toEqual([[1]])
    }
  })

  it('handles spec removal', async () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [1, 2],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: {
            template: '<div class="select-filter" @click="$emit(\'remove\', 1)"></div>',
          },
          Button: true,
        },
      },
    })

    const selectFilters = wrapper.findAll('.select-filter')
    if (selectFilters.length > 0) {
      await selectFilters[0].trigger('click')

      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')?.[0]).toEqual([[2]])
    }
  })

  it('uses inline layout when inline prop is true', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        categories: [],
        statuses: [],
        inline: true,
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: true,
          Button: true,
        },
      },
    })

    const container = wrapper.find('.flex-row')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('flex-wrap')
  })

  it('uses column layout by default', () => {
    const wrapper = mount(Filters, {
      props: {
        specs: mockSpecs,
        selectedIds: [],
        categories: [],
        statuses: [],
      },
      global: {
        stubs: {
          FilterCard: true,
          SelectFilter: true,
          Button: true,
        },
      },
    })

    const container = wrapper.find('.flex-col')
    expect(container.exists()).toBe(true)
  })
})
