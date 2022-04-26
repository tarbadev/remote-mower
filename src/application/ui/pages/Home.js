import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Battery50Icon from '@material-ui/icons/Battery50'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { DurationModal } from '../components/DurationModal'
import {
  getMowerSettings,
  getMowerStatus,
  initializeMowerId,
  MowerActivity,
  MowerState,
  parkForDuration,
  parkUntilFurtherNotice,
  parkUntilNextStart,
  pause,
  startAndResume,
  startForDuration,
} from '../../../domain/MowerService'
import { CuttingLevelIcon } from '../icons/CuttingLevelIcon'
import { useSchedule } from '../../hooks/useSchedule'
import { ScheduleColumn } from '../components/ScheduleColumn'

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
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [cuttingLevel, setCuttingLevel] = useState(0)
  const [mowerActivity, setMowerActivity] = useState('')
  const [mowerState, setMowerState] = useState('')
  const [displayParkDurationModal, setDisplayParkDurationModal] = useState(false)
  const [displayStartDurationModal, setDisplayStartDurationModal] = useState(false)
  const [parkAnchorEl, setParkAnchorEl] = React.useState()
  const [startAnchorEl, setStartAnchorEl] = React.useState()
  const [schedule] = useSchedule()

  const currentDate = new Date()
  const today = currentDate.toLocaleDateString('en-US', { weekday: 'long' })

  currentDate.setDate(currentDate.getDate() + 1)
  const tomorrow = currentDate
    .toLocaleDateString('en-US', { weekday: 'long' })

  const loadMowerDetails = () =>
    initializeMowerId()
      .then(getMowerStatus)
      .then(status => {
        setBatteryLevel(status.batteryLevel)
        setMowerActivity(activityToDisplayActivity(status.activity))
        setMowerState(stateToDisplayState(status.state))
      })
      .then(getMowerSettings)
      .then(settings => {
        setCuttingLevel(settings.cuttingLevel)
      })

  useEffect(() => {
    loadMowerDetails()
  }, [])

  const onParkUntilFurtherNoticeClick = () => parkUntilFurtherNotice()
    .then(loadMowerDetails)
    .then(closeParkMenu)

  const onParkUntilNextStartClick = () => parkUntilNextStart()
    .then(loadMowerDetails)
    .then(closeParkMenu)

  const onParkForDurationClick = () => {
    setDisplayParkDurationModal(true)
    closeParkMenu()
  }

  const onStartForDurationClick = () => {
    setDisplayStartDurationModal(true)
    closeStartMenu()
  }

  const closeParkDurationModal = () => setDisplayParkDurationModal(false)
  const closeStartDurationModal = () => setDisplayStartDurationModal(false)

  const submitParkForDuration = minutes => parkForDuration(minutes)
    .then(loadMowerDetails)
    .then(closeParkDurationModal)

  const onStartAndResumeClick = () => startAndResume()
    .then(loadMowerDetails)
    .then(closeStartMenu)

  const submitStartForDuration = minutes => startForDuration(minutes)
    .then(loadMowerDetails)
    .then(closeStartDurationModal)

  const closeParkMenu = () => setParkAnchorEl(null)
  const closeStartMenu = () => setStartAnchorEl(null)

  return <HomeDisplay
    batteryLevel={batteryLevel}
    cuttingLevel={cuttingLevel}
    mowerActivity={mowerActivity}
    mowerState={mowerState}
    onRefreshClick={loadMowerDetails}
    openParkMenu={({ target }) => setParkAnchorEl(target)}
    closeParkMenu={closeParkMenu}
    parkAnchorEl={parkAnchorEl}
    onParkUntilFurtherNoticeClick={onParkUntilFurtherNoticeClick}
    onParkUntilNextStartClick={onParkUntilNextStartClick}
    onParkForDurationClick={onParkForDurationClick}
    displayParkDurationModal={displayParkDurationModal}
    closeParkDurationModal={closeParkDurationModal}
    submitParkForDuration={submitParkForDuration}
    onPauseClick={() => pause()}
    openStartMenu={({ target }) => setStartAnchorEl(target)}
    closeStartMenu={closeStartMenu}
    onStartAndResumeClick={onStartAndResumeClick}
    startAnchorEl={startAnchorEl}
    onStartForDurationClick={onStartForDurationClick}
    displayStartDurationModal={displayStartDurationModal}
    closeStartDurationModal={closeStartDurationModal}
    submitStartForDuration={submitStartForDuration}
    schedule={schedule}
    today={today.toLowerCase()}
    tomorrow={tomorrow.toLowerCase()}
  />
}

const HomeDisplay = ({
  batteryLevel,
  mowerActivity,
  mowerState,
  cuttingLevel,
  onRefreshClick,
  openParkMenu,
  closeParkMenu,
  parkAnchorEl,
  onParkUntilFurtherNoticeClick,
  onParkUntilNextStartClick,
  onParkForDurationClick,
  displayParkDurationModal,
  closeParkDurationModal,
  submitParkForDuration,
  onPauseClick,
  openStartMenu,
  closeStartMenu,
  onStartAndResumeClick,
  startAnchorEl,
  onStartForDurationClick,
  displayStartDurationModal,
  closeStartDurationModal,
  submitStartForDuration,
  schedule,
  today,
  tomorrow,
}) => {
  const { t } = useTranslation()

  return <div data-home-container>
    <Grid container direction="row">
      <Grid item xs={8} container direction="row" spacing={1} alignContent="center">
        <Grid item>
          <Typography data-battery-level><Battery50Icon />{batteryLevel}</Typography>
        </Grid>
        <Grid item>
          <Typography data-cutting-level><CuttingLevelIcon />{cuttingLevel}</Typography>
        </Grid>
      </Grid>
      <Grid item xs container alignContent="flex-end" direction="column">
        <IconButton data-refresh-button
                    onClick={onRefreshClick}
                    color="primary"><RefreshIcon /></IconButton>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('home.activity.label')}: <span data-mower-activity>{t(`home.activity.${mowerActivity}`)}</span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('home.state.label')}: <span data-mower-state>{t(`home.state.${mowerState}`)}</span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" onClick={openParkMenu}
                data-park-button>{t('home.menus.park.label')}</Button>
        <Menu
          anchorEl={parkAnchorEl}
          keepMounted
          open={Boolean(parkAnchorEl)}
          onClose={closeParkMenu}
        >
          <MenuItem onClick={onParkUntilFurtherNoticeClick} data-park-until-further-notice-menu>{t(
            'home.menus.park.untilFurtherNotice')}</MenuItem>
          <MenuItem onClick={onParkUntilNextStartClick} data-park-until-next-start-menu>{t(
            'home.menus.park.untilNextStart')}</MenuItem>
          <MenuItem onClick={onParkForDurationClick} data-park-for-duration-menu>{t(
            'home.menus.park.forDuration')}</MenuItem>
        </Menu>
        <Button variant="outlined" color="primary" onClick={openStartMenu}
                data-start-button>{t('home.menus.start.label')}</Button>
        <Menu
          anchorEl={startAnchorEl}
          keepMounted
          open={Boolean(startAnchorEl)}
          onClose={closeStartMenu}
        >
          <MenuItem onClick={onStartAndResumeClick} data-start-and-resume-menu>{t(
            'home.menus.start.startAndResume')}</MenuItem>
          <MenuItem onClick={onStartForDurationClick} data-start-for-duration-menu>{t(
            'home.menus.start.forDuration')}</MenuItem>
        </Menu>
        <Button variant="outlined" color="primary" onClick={onPauseClick}
                data-pause-button>{t('home.menus.pause')}</Button>
      </Grid>
      <Grid item xs={12} container direction="row" spacing={1} alignItems="stretch" style={{ height: '400px' }}>
        <Grid item xs>
          <ScheduleColumn day={today} schedule={schedule} />
        </Grid>
        <Grid item xs>
          <ScheduleColumn day={tomorrow} schedule={schedule} />
        </Grid>
      </Grid>
    </Grid>

    <DurationModal open={displayParkDurationModal} onClose={closeParkDurationModal}
                   onSubmit={submitParkForDuration} submitLabel={t('home.menus.park.dialog.submit')} />

    <DurationModal open={displayStartDurationModal} onClose={closeStartDurationModal}
                   onSubmit={submitStartForDuration} submitLabel={t('home.menus.start.dialog.submit')} />
  </div>
}