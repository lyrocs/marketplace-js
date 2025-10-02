import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SimilarDealCard from './SimilarDealCard.vue'

describe('SimilarDealCard', () => {
  const mockDeal = {
    id: 1,
    title: 'Similar Deal',
    price: 79.99,
    currency: 'EUR',
    images: ['https://example.com/deal.jpg'],
    location: 'Lyon',
  }

  it('renders deal title', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('Similar Deal')
  })

  it('renders deal price with currency', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('79.99 EUR')
  })

  it('renders deal location when provided', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.text()).toContain('Lyon')
  })

  it('does not render location when not provided', () => {
    const dealWithoutLocation = {
      ...mockDeal,
      location: undefined,
    }

    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: dealWithoutLocation,
      },
    })

    expect(wrapper.find('.similar-deal-location').exists()).toBe(false)
  })

  it('renders deal image', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/deal.jpg')
    expect(img.attributes('alt')).toBe('Similar Deal')
  })

  it('renders placeholder when no images', () => {
    const dealWithoutImages = {
      ...mockDeal,
      images: undefined,
    }

    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: dealWithoutImages,
      },
    })

    expect(wrapper.find('.similar-deal-no-image').exists()).toBe(true)
    expect(wrapper.text()).toContain("Pas d'image")
  })

  it('has correct deal link', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/deals/1')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    expect(wrapper.find('.similar-deal-card').exists()).toBe(true)
    expect(wrapper.find('.similar-deal-image-container').exists()).toBe(true)
    expect(wrapper.find('.similar-deal-content').exists()).toBe(true)
    expect(wrapper.find('.similar-deal-title').exists()).toBe(true)
    expect(wrapper.find('.similar-deal-price').exists()).toBe(true)
  })

  it('applies hover classes', () => {
    const wrapper = mount(SimilarDealCard, {
      props: {
        deal: mockDeal,
      },
    })

    const card = wrapper.find('a')
    expect(card.classes()).toContain('similar-deal-card')
  })
})
