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

import { getMowerSettings, getMowerStatus, initializeMowerId, MowerActivity, MowerState } from './MowerService'
import { useAppContext } from './StoreProvider'
import { Loader } from './Loader'

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

const LogoutIcon = (props) => {
  return (
      <SvgIcon {...props}>
        <path
            d='M6 2h9a2 2 0 0 1 2 2v1a1 1 0 0 1-2 0V4H6v16h9v-1a1 1 0 0 1 2 0v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z' />
        <path
            d='M16.795 16.295c.39.39 1.02.39 1.41 0l3.588-3.588a1 1 0 0 0 0-1.414l-3.588-3.588a.999.999 0 0 0-1.411 1.411L18.67 11H10a1 1 0 0 0 0 2h8.67l-1.876 1.884a.999.999 0 0 0 .001 1.411z' />
      </SvgIcon>
  )
}

const CuttingLevelIcon = (props) => {
  return (
      <SvgIcon width='96.000000pt'
               height='96.000000pt'
               viewBox='0 0 96.000000 96.000000'
               preserveAspectRatio='xMidYMid meet' {...props}>
        <g transform='translate(0.000000,96.000000) scale(0.100000,-0.100000)' fill='#000000' stroke='none'>
          <path d='M78 869 c-31 -44 -36 -69 -13 -69 24 0 22 -198 -2 -215 -15 -11 -16 -16 -4 -37 7 -14 23 -38 37 -54 l24 -29 24 29 c14 16 30 40 37 54 12 21 11 26 -4 37 -24 17 -26 215 -2 215 8 0 15 7 15 16 0 23 -53 94 -70 93 -8 0 -27 -18 -42 -40z' />
          <path d='M813 851 c-62 -45 -110 -108 -164 -214 l-49 -99 0 -229 0 -229 45 0 c43 0 45 1 45 29 0 37 36 153 65 211 13 25 44 73 69 108 45 61 57 92 35 92 -15 0 -97 -61 -133 -99 -17 -17 -33 -31 -36 -31 -11 0 8 108 31 179 25 79 70 170 115 234 33 45 43 77 26 77 -5 0 -27 -13 -49 -29z' />
          <path d='M407 514 c-4 -4 -7 -103 -7 -221 l0 -213 80 0 80 0 -2 218 -3 217 -70 3 c-39 1 -74 0 -78 -4z' />
          <path d='M80 241 l0 -161 40 0 41 0 -3 158 -3 157 -37 3 -38 3 0 -160z' />
          <path d='M207 394 c-4 -4 -7 -76 -7 -161 l0 -153 80 0 81 0 -3 158 -3 157 -70 3 c-39 1 -74 0 -78 -4z' />
        </g>
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