import React, { useEffect, useState } from 'react'
import { AppBar, Box, Card, Grid, Toolbar, Typography } from '@material-ui/core'
import { getMowerSchedule, setMowerSchedule } from './MowerScheduleService'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { minuteToTimeString } from './Utils'
import { useTranslation } from 'react-i18next'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

export const EditSchedule = () => {
  const [schedules, setSchedules] = useState([])
  const history = useHistory()

  const loadSchedules = () => getMowerSchedule().then(setSchedules)

  useEffect(() => {
    loadSchedules()
  }, [])

  return <EditScheduleDisplay
    schedules={schedules}
    onBackClick={() => history.push('/schedule')}
    removeSchedule={(index) => {
      schedules[index] = undefined
      setSchedules(schedules.filter(schedule => schedule !== undefined))
    }}
    onSaveClick={() => setMowerSchedule(schedules).then(loadSchedules)}/>
}

const useStyles = makeStyles((theme) => {
  const drawerWidth = 200
  const appBarHeight = 66

  return {
    appBar: {
      marginLeft: drawerWidth,
      height: appBarHeight,
      backgroundColor: 'white',
    },
    scheduleContainer: {
      paddingTop: appBarHeight,
    },
    selectedDay: {
      backgroundColor: '#76d275',
      borderRadius: '5px',
      fontWeight: 'bold',
    },
    day: {
      padding: '5px',
    },
    timeContainer: {
      color: '#333',
    },
    time: {
      fontWeight: 'bold',
      color: '#e57373',
    },
  }
})

const ScheduleCardDay = ({ day, schedule }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const className = schedule.days[day] ? `${classes.selectedDay} ${classes.day}` : classes.day

  return <Grid item xs>
    <Typography className={className} align='center'>{t(`schedule.day.${day}`)}</Typography>
  </Grid>
}

const ScheduleCard = ({ schedule, onDeleteButtonClick }) => {
  const classes = useStyles()
  const beginTime = minuteToTimeString(schedule.start)
  const endTime = minuteToTimeString(schedule.start + schedule.duration)

  return <Card data-schedule-card>
    <Box paddingY={2} paddingX={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} container justify='space-between' alignItems='center'>
          <Grid item>
            <Typography variant='h5' className={classes.timeContainer}>
              <span className={classes.time}>{beginTime}</span> - <span className={classes.time}>{endTime}</span>
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={onDeleteButtonClick} data-delete-schedule-button><DeleteIcon /></IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1}>
          <ScheduleCardDay schedule={schedule} day='monday' />
          <ScheduleCardDay schedule={schedule} day='tuesday' />
          <ScheduleCardDay schedule={schedule} day='wednesday' />
          <ScheduleCardDay schedule={schedule} day='thursday' />
          <ScheduleCardDay schedule={schedule} day='friday' />
          <ScheduleCardDay schedule={schedule} day='saturday' />
          <ScheduleCardDay schedule={schedule} day='sunday' />
        </Grid>
      </Grid>
    </Box>
  </Card>
}

const EditScheduleDisplay = ({ schedules, onBackClick, removeSchedule, onSaveClick }) => {
  const classes = useStyles()

  return (
    <div style={{ height: '100%' }}>
      <AppBar className={classes.appBar} variant='outlined'>
        <Toolbar className={classes.appBar}>
          <Grid container justify='space-between'>
            <Grid item><Button onClick={onBackClick}>Back</Button></Grid>
            <Grid item><Button onClick={onSaveClick} data-schedule-save-button>Save</Button></Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container direction='row' spacing={1} className={classes.scheduleContainer}
            data-edit-schedule-container>
        {schedules.map((schedule, index) =>
          <Grid key={`schedule-card-${index}`} item xs={12}>
            <ScheduleCard schedule={schedule} onDeleteButtonClick={() => removeSchedule(index)} />
          </Grid>)}
      </Grid>
    </div>
  )
}