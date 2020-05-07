import React from 'react'
import { Container, CssBaseline } from '@material-ui/core'
import { Login } from './Login'
import { Route, Switch } from 'react-router-dom'
import { Home } from './Home'

export const App = () => {
  return (
    <div>
      <CssBaseline />
      <main>
        <Container maxWidth='xl'>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Container>
      </main>
    </div>
  )
}