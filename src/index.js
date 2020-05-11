import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import * as serviceWorker from './serviceWorker'
import { StoreProvider } from './StoreProvider'
import { HashRouter } from 'react-router-dom'

import './i18n'

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