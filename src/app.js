import React from 'react'
import { Container, CssBaseline } from '@material-ui/core'
import { Login } from './login'

export const App = () => {
  return (
    <div>
      <CssBaseline />
      <main>
        <Container maxWidth='xl'>
          <Login />
        </Container>
      </main>
    </div>
  )
}