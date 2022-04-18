import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    saveMissing: true,
    saveMissingTo: 'current',

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
    whitelist: ['en', 'fr'],
    react: {
      wait: false,
    },
    initImmediate: false,
  }, (error, t) => {
    if (error) {
      console.log(error)
    }
  })

export default i18n