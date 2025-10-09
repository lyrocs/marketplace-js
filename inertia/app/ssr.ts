import '../css/app.css'
import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import { Link } from '@inertiajs/vue3'
import i18next from '~/i18n'
import I18NextVue from 'i18next-vue'
import GuestLayout from '~/layouts/GuestLayout.vue'

const appName = import.meta.env.VITE_APP_NAME || 'Marketplace.js'

export default function render(page: any) {
  return createInertiaApp({
    page,
    title: (title) => `${title} - ${appName}`,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
      const resolvedPage = pages[`../pages/${name}.vue`]

      resolvedPage.default.layout = resolvedPage.default.layout || GuestLayout

      return resolvedPage
    },

    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(I18NextVue, { i18next })
        .component('Link', Link)
    },
  })
}
