/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { Link } from '@inertiajs/vue3'
import i18next from '~/i18n'
import I18NextVue from 'i18next-vue'
import GuestLayout from '~/layouts/GuestLayout.vue'

const appName = import.meta.env.VITE_APP_NAME || 'Marketplace.js'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )

    page.default.layout = page.default.layout || GuestLayout

    return page
  },

  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(I18NextVue, { i18next })
      .component('Link', Link)
      .mount(el)
  },
})
