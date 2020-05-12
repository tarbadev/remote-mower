import i18n from 'i18next'
import Backend from '../shared/backend'

i18n
  .use(Backend)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2,
    },
    debug: false,
    saveMissing: true,
    saveMissingTo: 'current',
    lng: 'en',

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
    whitelist: ['en', 'fr'],
    react: {
      wait: false,
    },
  }, (error, t) => {
    if (error) {
      console.log(error)
    }
  })

export default i18n