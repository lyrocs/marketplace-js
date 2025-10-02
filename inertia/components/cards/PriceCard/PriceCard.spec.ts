import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PriceCard from './PriceCard.vue'

describe('PriceCard', () => {
  it('renders price with default currency', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 99.99,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('99.99 €')
  })

  it('renders price with custom currency', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 49.99,
        currency: '$',
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('49.99 $')
  })

  it('renders negotiable text by default', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('(Prix négociable)')
  })

  it('does not render negotiable text when negotiable is false', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
        negotiable: false,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).not.toContain('(Prix négociable)')
  })

  it('renders state when provided', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
        state: 'Excellent',
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).toContain('État : Excellent')
  })

  it('does not render state when not provided', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.text()).not.toContain('État :')
  })

  it('emits contact event when contact button is clicked', async () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    const contactButton = wrapper.findAll('button')[0]
    await contactButton.trigger('click')

    expect(wrapper.emitted('contact')).toBeTruthy()
    expect(wrapper.emitted('contact')?.length).toBe(1)
  })

  it('emits makeOffer event when make offer button is clicked', async () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    const offerButton = wrapper.findAll('button')[1]
    await offerButton.trigger('click')

    expect(wrapper.emitted('makeOffer')).toBeTruthy()
    expect(wrapper.emitted('makeOffer')?.length).toBe(1)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(PriceCard, {
      props: {
        price: 100,
      },
      global: {
        stubs: {
          IconChatBubbleOutline: true,
        },
      },
    })

    expect(wrapper.find('.price-card').exists()).toBe(true)
    expect(wrapper.find('.price-value').exists()).toBe(true)
    expect(wrapper.find('.price-actions').exists()).toBe(true)
  })
})
