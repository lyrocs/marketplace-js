import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminTable from './AdminTable.vue'

describe('AdminTable', () => {
  const mockColumns = [
    { key: 'name', label: 'Name', type: 'text', editable: true },
    { key: 'email', label: 'Email', type: 'text', editable: true },
  ]

  const mockItems = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]

  it('renders table with items', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('jane@example.com')
  })

  it('renders column headers', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Email')
  })

  it('shows create form when canCreate is true', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
        canCreate: true,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    expect(wrapper.find('form-stub').exists()).toBe(true)
  })

  it('emits create:item event on form submit', async () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
        canCreate: true,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.createBuffer = { name: 'New Item', email: 'new@example.com' }
    vm.createCategory()

    expect(wrapper.emitted('create:item')).toBeTruthy()
  })

  it('starts edit mode when startEdit is called', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.startEdit(0, mockItems[0])

    expect(vm.editingRow).toBe(0)
    expect(vm.editBuffer).toEqual(mockItems[0])
  })

  it('cancels edit mode when cancelEdit is called', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.startEdit(0, mockItems[0])
    vm.cancelEdit()

    expect(vm.editingRow).toBe(null)
    expect(vm.editBuffer).toEqual({})
  })

  it('emits update:item event when saveEdit is called', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.startEdit(0, mockItems[0])
    vm.editBuffer.name = 'Updated Name'
    vm.saveEdit(0)

    expect(wrapper.emitted('update:item')).toBeTruthy()
  })

  it('emits delete:item event when deleteItem is called', () => {
    const wrapper = mount(AdminTable, {
      props: {
        items: mockItems,
        columns: mockColumns,
      },
      global: {
        stubs: {
          Form: true,
          Button: true,
          Select: true,
          SelectTrigger: true,
          SelectValue: true,
          SelectContent: true,
          SelectGroup: true,
          SelectItem: true,
          TagsInput: true,
          TagsInputItem: true,
          TagsInputItemText: true,
          TagsInputItemDelete: true,
          TagsInputInput: true,
          DropdownMenu: true,
          DropdownMenuTrigger: true,
          DropdownMenuContent: true,
          DropdownMenuItem: true,
          Badge: true,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.deleteItem(mockItems[0])

    expect(wrapper.emitted('delete:item')).toBeTruthy()
    expect(wrapper.emitted('delete:item')?.[0]).toEqual([mockItems[0]])
  })
})
