import i18next from 'i18next'
import fr from './fr'
import en from './en'

i18next.init({
  lng: 'fr',
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
})

export default i18next
