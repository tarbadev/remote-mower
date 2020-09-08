import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { logout } from './LoginService'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Battery50Icon from '@material-ui/icons/Battery50'
import { useTranslation } from 'react-i18next'

import { getMowerSettings, getMowerStatus, initializeMowerId, MowerActivity, MowerState } from './MowerService'
import { useAppContext } from './StoreProvider'
import { Loader } from './Loader'
import { CuttingLevelIcon, LogoutIcon } from './ui/Icons'

const activityToDisplayActivity = activity => {
  switch (activity) {
    case MowerActivity.NOT_APPLICABLE:
      return 'notApplicable'
    case MowerActivity.MOWING:
      return 'mowing'
    case MowerActivity.GOING_TO_CS:
      return 'goingToCs'
    case MowerActivity.CHARGING:
      return 'charging'
    case MowerActivity.LEAVING_CS:
      return 'leavingCs'
    case MowerActivity.PARKED_IN_CS:
      return 'parkedInCs'
    case MowerActivity.STOPPED_IN_GARDEN:
      return 'stoppedInGarden'
    default:
      return 'unknown'
  }
}

const stateToDisplayState = state => {
  switch (state) {
    case MowerState.NOT_APPLICABLE:
      return 'notApplicable'
    case MowerState.PAUSED:
      return 'paused'
    case MowerState.IN_OPERATION:
      return 'inOperation'
    case MowerState.WAIT_UPDATING:
      return 'waitUpdating'
    case MowerState.WAIT_POWER_UP:
      return 'waitPowerUp'
    case MowerState.RESTRICTED:
      return 'restricted'
    case MowerState.OFF:
      return 'off'
    case MowerState.STOPPED:
      return 'stopped'
    case MowerState.ERROR:
    case MowerState.FATAL_ERROR:
    case MowerState.ERROR_AT_POWER_UP:
      return 'error'
    default:
      return 'unknown'
  }
}

export const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState()
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [cuttingLevel, setCuttingLevel] = useState(0)
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
      initializeMowerId().then(() => {
        getMowerStatus().then(status => {
          setBatteryLevel(status.batteryLevel)
          setMowerActivity(activityToDisplayActivity(status.activity))
          setMowerState(stateToDisplayState(status.state))
        })
        getMowerSettings().then(settings => {
          setCuttingLevel(settings.cuttingLevel)
        })
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
        cuttingLevel={cuttingLevel}
        mowerActivity={mowerActivity}
        mowerState={mowerState}
    />
  </Suspense>
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

const HomeDisplay = ({ onLogoutButtonClicked, batteryLevel, mowerActivity, mowerState, cuttingLevel }) => {
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
      <Typography data-cutting-level><CuttingLevelIcon />{cuttingLevel}</Typography>
      <Typography>{t('home.activity.label')}: <span data-mower-activity>{t(`home.activity.${mowerActivity}`)}</span></Typography>
      <Typography>{t('home.state.label')}: <span data-mower-state>{t(`home.state.${mowerState}`)}</span></Typography>
    </main>
  </div>
}