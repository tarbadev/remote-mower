import React, { useCallback, useEffect, useState } from 'react'
import { useAppContext } from './StoreProvider'
import { Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { logout } from './LoginService'

export const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState()
  const { isUserLoggedIn } = useAppContext()

  const isLoggedInAsync = useCallback(async () => {
    setUserLoggedIn(await isUserLoggedIn())
  }, [isUserLoggedIn])

  useEffect(() => {
    isLoggedInAsync()
  }, [isLoggedInAsync])

  if (userLoggedIn == null) {
    return <div />
  } else if (!userLoggedIn) {
    return <Redirect to='/login' />
  }

  return <HomeDisplay onLogoutButtonClicked={() => logout(isLoggedInAsync)} />
}

const HomeDisplay = ({ onLogoutButtonClicked }) => {
  return <Container data-home-container>
    <Button onClick={onLogoutButtonClicked} data-logout-button>Logout</Button>
    <div>Home</div>
  </Container>
}