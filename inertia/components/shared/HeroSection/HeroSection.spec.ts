import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from './HeroSection.vue'
import { router } from '@inertiajs/vue3'

vi.mock('@inertiajs/vue3', () => ({
  router: {
    get: vi.fn(),
  },
}))

describe('HeroSection', () => {
  it('renders with all props', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Welcome to Marketplace',
        description: 'Find the best deals',
        backgroundImage: '/hero-bg.jpg',
      },
    })

    expect(wrapper.find('.hero-title').text()).toBe('Welcome to Marketplace')
    expect(wrapper.find('.hero-description').text()).toBe('Find the best deals')
  })

  it('applies background image style', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: 'https://example.com/bg.jpg',
      },
    })

    const background = wrapper.find('.hero-background')
    expect(background.attributes('style')).toContain('background-image')
    expect(background.attributes('style')).toContain('https://example.com/bg.jpg')
  })

  it('renders with default search placeholder', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('placeholder')).toBe('Que recherchez-vous ?')
  })

  it('renders with custom search placeholder', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
        searchPlaceholder: 'Search products...',
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('placeholder')).toBe('Search products...')
  })

  it('updates search input on user input', async () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('drone')

    expect((input.element as HTMLInputElement).value).toBe('drone')
  })

  it('calls router.get on enter key with search value', async () => {
    const routerGetSpy = vi.mocked(router.get)
    routerGetSpy.mockClear()

    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('fpv drone')

    // Find the Input component and trigger the keyup.enter event
    const component = wrapper.vm as any
    component.searchInput = 'fpv drone'
    component.search()

    expect(router.get).toHaveBeenCalledWith('/products/search/fpv drone')
  })

  it('does not call router.get on enter with empty search', async () => {
    const routerGetSpy = vi.mocked(router.get)
    routerGetSpy.mockClear()

    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('   ')
    await input.trigger('keyup.enter')

    expect(router.get).not.toHaveBeenCalled()
  })

  it('renders search icon', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    expect(wrapper.find('.hero-search-icon').exists()).toBe(true)
  })

  it('renders overlay', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    expect(wrapper.find('.hero-overlay').exists()).toBe(true)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(HeroSection, {
      props: {
        title: 'Title',
        description: 'Description',
        backgroundImage: '/bg.jpg',
      },
    })

    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.find('.hero-background').exists()).toBe(true)
    expect(wrapper.find('.hero-overlay').exists()).toBe(true)
    expect(wrapper.find('.hero-content').exists()).toBe(true)
    expect(wrapper.find('.hero-title').exists()).toBe(true)
    expect(wrapper.find('.hero-description').exists()).toBe(true)
    expect(wrapper.find('.hero-search-wrapper').exists()).toBe(true)
    expect(wrapper.find('.hero-search-container').exists()).toBe(true)
  })
})
