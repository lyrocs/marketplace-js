import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductGallery from './ProductGallery.vue'

describe('ProductGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]

  it('renders main image', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const mainImage = wrapper.find('.gallery-main-image')
    expect(mainImage.exists()).toBe(true)
    expect(mainImage.attributes('src')).toBe(mockImages[0])
    expect(mainImage.attributes('alt')).toBe('Image principale du produit')
  })

  it('renders thumbnails when multiple images', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const thumbnails = wrapper.findAll('.gallery-thumbnail')
    expect(thumbnails).toHaveLength(3)
  })

  it('does not render thumbnails when single image', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: [mockImages[0]],
      },
    })

    const thumbnailsContainer = wrapper.find('.gallery-thumbnails')
    expect(thumbnailsContainer.exists()).toBe(false)
  })

  it('changes main image when thumbnail is clicked', async () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const thumbnails = wrapper.findAll('.gallery-thumbnail')
    await thumbnails[1].trigger('click')

    const mainImage = wrapper.find('.gallery-main-image')
    expect(mainImage.attributes('src')).toBe(mockImages[1])
  })

  it('applies active class to selected thumbnail', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const thumbnails = wrapper.findAll('.gallery-thumbnail')
    expect(thumbnails[0].classes()).toContain('gallery-thumbnail-active')
    expect(thumbnails[1].classes()).toContain('gallery-thumbnail-inactive')
    expect(thumbnails[2].classes()).toContain('gallery-thumbnail-inactive')
  })

  it('updates active class when thumbnail is clicked', async () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const thumbnails = wrapper.findAll('.gallery-thumbnail')
    await thumbnails[2].trigger('click')

    expect(thumbnails[0].classes()).toContain('gallery-thumbnail-inactive')
    expect(thumbnails[1].classes()).toContain('gallery-thumbnail-inactive')
    expect(thumbnails[2].classes()).toContain('gallery-thumbnail-active')
  })

  it('renders default placeholder when no images provided', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: [],
      },
    })

    const mainImage = wrapper.find('.gallery-main-image')
    expect(mainImage.attributes('src')).toBe('https://placehold.co/400x300/475569/white?text=Image')
  })

  it('renders custom default image when provided', () => {
    const customDefault = 'https://example.com/custom-default.jpg'
    const wrapper = mount(ProductGallery, {
      props: {
        images: [],
        defaultImage: customDefault,
      },
    })

    const mainImage = wrapper.find('.gallery-main-image')
    expect(mainImage.attributes('src')).toBe(customDefault)
  })

  it('renders thumbnail images with correct alt text', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: mockImages,
      },
    })

    const thumbnailImages = wrapper.findAll('.gallery-thumbnail-image')
    thumbnailImages.forEach((img, index) => {
      expect(img.attributes('src')).toBe(mockImages[index])
      expect(img.attributes('alt')).toBe(`Image ${index + 1} du produit`)
    })
  })

  it('does not render thumbnails when empty images array', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images: [],
      },
    })

    const thumbnailsContainer = wrapper.find('.gallery-thumbnails')
    expect(thumbnailsContainer.exists()).toBe(false)
  })
})
