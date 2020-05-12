import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { logout } from './LoginService'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SvgIcon from '@material-ui/core/SvgIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Battery50Icon from '@material-ui/icons/Battery50'
import { useTranslation } from 'react-i18next'

import { getMowerStatus, MowerActivity, MowerState } from './MowerService'
import { useAppContext } from './StoreProvider'
import { Loader } from './Loader'

export const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState()
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [mowerActivity, setMowerActivity] = useState('')
  const [mowerState, setMowerState] = useState('')
  const { isUserLoggedIn } = useAppContext()

  const isLoggedInAsync = useCallback(async () => {
    setUserLoggedIn(await isUserLoggedIn())
  }, [isUserLoggedIn])

  useEffect(() => {
    isLoggedInAsync()
  }, [isLoggedInAsync])

  useEffect(() => {
    if (userLoggedIn) {
      getMowerStatus().then(status => {
        setBatteryLevel(status.batteryLevel)
        switch (status.activity) {
          case MowerActivity.NOT_APPLICABLE:
            setMowerActivity('notApplicable')
            break
          case MowerActivity.MOWING:
            setMowerActivity('mowing')
            break
          case MowerActivity.GOING_TO_CS:
            setMowerActivity('goingToCs')
            break
          case MowerActivity.CHARGING:
            setMowerActivity('charging')
            break
          case MowerActivity.LEAVING_CS:
            setMowerActivity('leavingCs')
            break
          case MowerActivity.PARKED_IN_CS:
            setMowerActivity('parkedInCs')
            break
          case MowerActivity.STOPPED_IN_GARDEN:
            setMowerActivity('stoppedInGarden')
            break
          default:
            setMowerActivity('unknown')
        }
        switch (status.state) {
          case MowerState.NOT_APPLICABLE:
            setMowerState('notApplicable')
            break
          case MowerState.PAUSED:
            setMowerState('paused')
            break
          case MowerState.IN_OPERATION:
            setMowerState('inOperation')
            break
          case MowerState.WAIT_UPDATING:
            setMowerState('waitUpdating')
            break
          case MowerState.WAIT_POWER_UP:
            setMowerState('waitPowerUp')
            break
          case MowerState.RESTRICTED:
            setMowerState('restricted')
            break
          case MowerState.OFF:
            setMowerState('off')
            break
          case MowerState.STOPPED:
            setMowerState('stopped')
            break
          case MowerState.ERROR:
          case MowerState.FATAL_ERROR:
          case MowerState.ERROR_AT_POWER_UP:
            setMowerState('error')
            break
          default:
            setMowerState('unknown')
        }
      })
    }
  }, [userLoggedIn])

  if (userLoggedIn == null) {
    return <Loader />
  } else if (!userLoggedIn) {
    return <Redirect to='/login' />
  }

  return <Suspense fallback={<Loader />}>
    <HomeDisplay
      onLogoutButtonClicked={() => logout(isLoggedInAsync)}
      batteryLevel={batteryLevel}
      mowerActivity={mowerActivity}
      mowerState={mowerState}
    />
  </Suspense>
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

const useStyles = makeStyles((theme) => {
  const drawerWidth = 150

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

const HomeDisplay = ({ onLogoutButtonClicked, batteryLevel, mowerActivity, mowerState }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return <div data-home-container className={classes.root}>
    <Drawer
      variant='permanent'
      anchor='left'
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <Divider />
        <List>
          <ListItem button onClick={onLogoutButtonClicked} data-logout-button>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary={t('home.logoutLabel')} />
          </ListItem>
        </List>
      </div>
    </Drawer>
    <main className={classes.content}>
      <Typography data-battery-level><Battery50Icon />{batteryLevel}</Typography>
      <Typography>{t('home.activity.label')}: <span data-mower-activity>{t(`home.activity.${mowerActivity}`)}</span></Typography>
      <Typography>{t('home.state.label')}: <span data-mower-state>{t(`home.state.${mowerState}`)}</span></Typography>
    </main>
  </div>
}