import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { logout } from './LoginService'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { useAppContext } from './StoreProvider'
import { Loader } from './Loader'
import { LogoutIcon, ScheduleIcon } from './ui/Icons'
import HomeIcon from '@material-ui/icons/Home'
import { Schedule } from './Schedule'
import { Home } from './Home'
import { EditSchedule } from './EditSchedule'

export const ConnectedUserContent = () => {
  const [userLoggedIn, setUserLoggedIn] = useState()
  const history = useHistory()
  const { isUserLoggedIn } = useAppContext()

  const isLoggedInAsync = useCallback(async () => {
    setUserLoggedIn(await isUserLoggedIn())
  }, [isUserLoggedIn])

  useEffect(() => {
    isLoggedInAsync()
  }, [isLoggedInAsync])

  if (userLoggedIn == null) {
    return <Loader />
  } else if (!userLoggedIn) {
    return <Redirect to='/login' />
  }

  return <Suspense fallback={<Loader />}>
    <ConnectedUserContentDisplay
      onLogoutButtonClicked={() => logout(isLoggedInAsync)}
      onHomeButtonClicked={() => history.push('/')}
      onScheduleButtonClicked={() => history.push('/schedule')}
    />
  </Suspense>
}

const useStyles = makeStyles((theme) => {
  const drawerWidth = 200

  return {
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
    },
  }
})

const ConnectedUserContentDisplay = ({
  onLogoutButtonClicked,
  onHomeButtonClicked,
  onScheduleButtonClicked,
}) => {
  const { t } = useTranslation()
  const location = useLocation()
  const classes = useStyles()

  return <div data-connected-user-container className={classes.root}>
    <Drawer
      variant='permanent'
      anchor='left'
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div>
        <Divider />
        <List>
          <ListItem button onClick={onLogoutButtonClicked} data-logout-button>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary={t('drawer.logout')} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={onHomeButtonClicked} selected={location.pathname === '/'}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={t('drawer.home')} />
          </ListItem>
          <ListItem button onClick={onScheduleButtonClicked} selected={location.pathname.startsWith('/schedule')}>
            <ListItemIcon><ScheduleIcon /></ListItemIcon>
            <ListItemText primary={t('drawer.schedule')} />
          </ListItem>
        </List>
      </div>
    </Drawer>
    <main className={classes.content} style={{ height: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/schedule" component={Schedule} />
        <Route exact path="/schedule/edit" component={EditSchedule} />
      </Switch>
    </main>
  </div>
}