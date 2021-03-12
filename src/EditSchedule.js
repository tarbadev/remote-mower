import React, { useEffect, useState } from 'react'
import { AppBar, Box, Card, Grid, Toolbar, Typography } from '@material-ui/core'
import { getMowerSchedule } from './MowerScheduleService'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { minuteToTimeString } from './Utils'
import { useTranslation } from 'react-i18next'

export const EditSchedule = () => {
  const [schedules, setSchedules] = useState([])
  const history = useHistory()

  useEffect(() => {
    getMowerSchedule().then(setSchedules)
  }, [])

  return <EditScheduleDisplay schedules={schedules} onBackClick={() => history.push('/schedule')} />
}

const useStyles = makeStyles((theme) => {
  const drawerWidth = 200
  const appBarHeight = 66

  return {
    appBar: {
      marginLeft: drawerWidth,
      height: appBarHeight,
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
      // fontSize: '20px',
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

const ScheduleCard = ({ schedule }) => {
  const classes = useStyles()
  const beginTime = minuteToTimeString(schedule.start)
  const endTime = minuteToTimeString(schedule.start + schedule.duration)

  return <Card>
    <Box paddingY={2} paddingX={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h5' className={classes.timeContainer}>
            <span className={classes.time}>{beginTime}</span> - <span className={classes.time}>{endTime}</span>
          </Typography>
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

const EditScheduleDisplay = ({ schedules, onBackClick }) => {
  const classes = useStyles()

  return (
    <div style={{ height: '100%' }}>
      <AppBar className={classes.appBar} color='white' variant='outlined'>
        <Toolbar className={classes.appBar}>
          <Grid container justify='flex-start'>
            <Grid item><Button onClick={onBackClick}>Back</Button></Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container direction='row' spacing={1} className={classes.scheduleContainer}
            data-edit-schedule-container>
        {schedules.map((schedule, index) =>
          <Grid key={`schedule-card-${index}`} item xs={12}>
            <ScheduleCard schedule={schedule} />
          </Grid>)}
      </Grid>
    </div>
  )
}