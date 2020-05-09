import React, { useCallback, useEffect, useState } from 'react'
import { useAppContext } from './StoreProvider'
import { Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { logout } from './LoginService'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SvgIcon from '@material-ui/core/SvgIcon'
import ListItemText from '@material-ui/core/ListItemText'

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

const LogoutIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M6 2h9a2 2 0 0 1 2 2v1a1 1 0 0 1-2 0V4H6v16h9v-1a1 1 0 0 1 2 0v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path
        d="M16.795 16.295c.39.39 1.02.39 1.41 0l3.588-3.588a1 1 0 0 0 0-1.414l-3.588-3.588a.999.999 0 0 0-1.411 1.411L18.67 11H10a1 1 0 0 0 0 2h8.67l-1.876 1.884a.999.999 0 0 0 .001 1.411z" />
    </SvgIcon>
  )
}

const HomeDisplay = ({ onLogoutButtonClicked }) => {
  return <Container data-home-container>
    <Button onClick={onLogoutButtonClicked} data-logout-button>Logout</Button>
    <Drawer
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        <ListItem button onClick={onLogoutButtonClicked} data-logout-button>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </Drawer>
    <div>Home</div>
  </Container>
}