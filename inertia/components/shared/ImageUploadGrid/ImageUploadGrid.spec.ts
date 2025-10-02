import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUploadGrid from './ImageUploadGrid.vue'

describe('ImageUploadGrid', () => {
  it('renders empty grid with upload label', () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: [],
      },
    })

    expect(wrapper.find('.image-upload-label').exists()).toBe(true)
    expect(wrapper.text()).toContain('+ Add Image')
    expect(wrapper.findAll('.image-preview').length).toBe(0)
  })

  it('renders images', () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      },
    })

    const previews = wrapper.findAll('.image-preview')
    expect(previews.length).toBe(3)

    const images = wrapper.findAll('img')
    expect(images[0].attributes('src')).toBe('image1.jpg')
    expect(images[1].attributes('src')).toBe('image2.jpg')
    expect(images[2].attributes('src')).toBe('image3.jpg')
  })

  it('renders remove button for each image', () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: ['image1.jpg', 'image2.jpg'],
      },
    })

    const removeButtons = wrapper.findAll('.image-remove-btn')
    expect(removeButtons.length).toBe(2)
  })

  it('emits remove event when remove button is clicked', async () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: ['image1.jpg', 'image2.jpg'],
      },
    })

    const removeButtons = wrapper.findAll('.image-remove-btn')
    await removeButtons[0].trigger('click')

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual(['image1.jpg'])
  })

  it('has file input with correct attributes', () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: [],
      },
    })

    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('accept')).toBe('image/*')
    expect(input.attributes('multiple')).toBeDefined()
  })

  it('emits upload event with files when files selected', async () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: [],
      },
    })

    const input = wrapper.find('input[type="file"]')
    const files = [
      new File(['content1'], 'image1.jpg', { type: 'image/jpeg' }),
      new File(['content2'], 'image2.jpg', { type: 'image/jpeg' }),
    ]

    Object.defineProperty(input.element, 'files', {
      value: files,
      writable: false,
    })

    await input.trigger('change')

    expect(wrapper.emitted('upload')).toBeTruthy()
    expect(wrapper.emitted('upload')?.[0][0]).toHaveLength(2)
  })

  it('resets input value after upload', async () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: [],
      },
    })

    const input = wrapper.find('input[type="file"]')
    const inputElement = input.element as HTMLInputElement
    const files = [new File(['content'], 'image.jpg', { type: 'image/jpeg' })]

    Object.defineProperty(inputElement, 'files', {
      value: files,
      writable: false,
    })

    await input.trigger('change')

    expect(inputElement.value).toBe('')
  })

  it('does not emit upload when no files selected', async () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: [],
      },
    })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [],
      writable: false,
    })

    await input.trigger('change')

    expect(wrapper.emitted('upload')).toBeFalsy()
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ImageUploadGrid, {
      props: {
        images: ['image1.jpg'],
      },
    })

    expect(wrapper.find('.image-grid').exists()).toBe(true)
    expect(wrapper.find('.image-preview').exists()).toBe(true)
    expect(wrapper.find('.image-preview-img').exists()).toBe(true)
    expect(wrapper.find('.image-upload-label').exists()).toBe(true)
    expect(wrapper.find('.image-upload-content').exists()).toBe(true)
    expect(wrapper.find('.image-upload-text').exists()).toBe(true)
  })
})
