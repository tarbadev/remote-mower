import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './ui/components/App'
import * as serviceWorker from './serviceWorker'
import { StoreProvider } from './StoreProvider'
import { HashRouter } from 'react-router-dom'
import i18n from './config/i18n.config'

window.api.bindI18nClient(i18n, lng => i18n.changeLanguage(lng))

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

serviceWorker.unregister()