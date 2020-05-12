import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import * as serviceWorker from './serviceWorker'
import { StoreProvider } from './StoreProvider'
import { HashRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './config/i18n.config'

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <HashRouter>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </HashRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

serviceWorker.unregister()