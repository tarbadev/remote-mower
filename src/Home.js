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
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { getMowerStatus, MowerActivity, MowerState } from './MowerService'
import Battery50Icon from '@material-ui/icons/Battery50'

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
            setMowerActivity('Manual start required')
            break
          case MowerActivity.MOWING:
            setMowerActivity('Mowing')
            break
          case MowerActivity.GOING_TO_CS:
            setMowerActivity('Going to Charging Station')
            break
          case MowerActivity.CHARGING:
            setMowerActivity('Charging')
            break
          case MowerActivity.LEAVING_CS:
            setMowerActivity('Leaving Charging Station')
            break
          case MowerActivity.PARKED_IN_CS:
            setMowerActivity('Parked in Charging Station')
            break
          case MowerActivity.STOPPED_IN_GARDEN:
            setMowerActivity('Mower stopped. Manual action required')
            break
          default:
            setMowerActivity('Unknown')
        }
        switch (status.state) {
          case MowerState.NOT_APPLICABLE:
            setMowerState('Not Applicable')
            break
          case MowerState.PAUSED:
            setMowerState('Paused')
            break
          case MowerState.IN_OPERATION:
            setMowerState('In operation')
            break
          case MowerState.WAIT_UPDATING:
            setMowerState('Downloading new firmware')
            break
          case MowerState.WAIT_POWER_UP:
            setMowerState('Performing power up tests')
            break
          case MowerState.RESTRICTED:
            setMowerState('Restricted: Cannot mow because because of week calendar or override park')
            break
          case MowerState.OFF:
            setMowerState('Mower turned off')
            break
          case MowerState.STOPPED:
            setMowerState('Mower stopped. Manual action required')
            break
          case MowerState.ERROR:
          case MowerState.FATAL_ERROR:
          case MowerState.ERROR_AT_POWER_UP:
            setMowerState('Error happened')
            break
          default:
            setMowerState('Unknown')
        }
      })
    }
  }, [userLoggedIn])

  if (userLoggedIn == null) {
    return <div />
  } else if (!userLoggedIn) {
    return <Redirect to='/login' />
  }

  return <HomeDisplay
    onLogoutButtonClicked={() => logout(isLoggedInAsync)}
    batteryLevel={batteryLevel}
    mowerActivity={mowerActivity}
    mowerState={mowerState}
  />
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const HomeDisplay = ({ onLogoutButtonClicked, batteryLevel, mowerActivity, mowerState }) => {
  const classes = useStyles()

  return <Container data-home-container className={classes.root}>
    <Button onClick={onLogoutButtonClicked} data-logout-button>Logout</Button>
    <Drawer
      variant='permanent'
      anchor='left'
      className={classes.drawer}
    >
      <div className={classes.drawerContainer}>
        <Divider />
        <List>
          <ListItem button onClick={onLogoutButtonClicked} data-logout-button>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </div>
    </Drawer>
    <main className={classes.content}>
      <Typography data-battery-level><Battery50Icon />{batteryLevel}</Typography>
      <Typography>Activity: <span data-mower-activity>{mowerActivity}</span></Typography>
      <Typography>State: <span data-mower-state>{mowerState}</span></Typography>
    </main>
  </Container>
}