import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { Login } from './Login'
import { Route, Switch } from 'react-router-dom'
import { Home } from './Home'

export const App = () => {
  return (
    <div>
      <CssBaseline />
      <main>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </main>
    </div>
  )
}