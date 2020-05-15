const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const LanguageDetector = require('i18next-electron-language-detector')
const path = require('path')

i18next
  .use(Backend)
  .use(LanguageDetector)

if (!i18next.isInitialized) {
  i18next
    .init({
      backend: {
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
      },
      debug: false,
      saveMissing: true,
      saveMissingTo: 'current',

      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },
      whitelist: ['en', 'fr'],
      nonExplicitWhitelist: true,
      react: {
        wait: false,
      },
      load: 'languageOnly',
    }, (error, t) => {
      if (error) {
        console.log(error)
      }
    })
}

module.exports = i18next