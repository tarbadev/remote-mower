import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { Login } from './Login'
import { Route, Switch } from 'react-router-dom'
import { ConnectedUserContent } from './ConnectedUserContent'

export const App = () => {
  return (
    <div>
      <CssBaseline />
      <main>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route component={ConnectedUserContent} />
          </Switch>
        </div>
      </main>
    </div>
  )
}