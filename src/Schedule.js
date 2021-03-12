import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppBar, Divider, Grid, Paper, Toolbar, Typography } from '@material-ui/core'
import { getMowerSchedule } from './MowerScheduleService'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { minuteToTimeString } from './Utils'

export const Schedule = () => {
  const [schedule, setSchedule] = useState([])
  const history = useHistory()

  useEffect(() => {
    getMowerSchedule().then(setSchedule)
  }, [])

  return <ScheduleDisplay schedule={schedule} onEditClick={() => history.push('/schedule/edit')} />
}

const ScheduledMowing = ({ schedule }) => {
  const minutesInDay = 60 * 24
  const top = schedule.start / minutesInDay * 100
  const height = schedule.duration / minutesInDay * 100

  const beginTime = minuteToTimeString(schedule.start)
  const endTime = minuteToTimeString(schedule.start + schedule.duration)

  return <Paper style={{
    backgroundColor: '#76d275',
    position: 'relative',
    top: `${top}%`,
    height: `${height}%`,
  }}>
    <Grid container direction='column' style={{ height: '100%' }}>
      <Grid item>
        <Typography align='center' style={{ color: '#333' }}>{beginTime}</Typography>
        <Divider />
      </Grid>
      <Grid item style={{ flexGrow: 1 }} />
      <Grid item>
        <Divider />
        <Typography align='center' style={{ color: '#333' }}>{endTime}</Typography>
      </Grid>
    </Grid>
  </Paper>
}

const ScheduleColumn = ({ day, schedules = [] }) => {
  const { t } = useTranslation()

  return <Grid container direction='column' style={{ height: '100%' }} alignContent='stretch'>
    <Grid item>
      <Typography align='center'>{t(`schedule.day.${day}`)}</Typography>
    </Grid>
    <Grid item style={{ flexGrow: 1 }}>
      <Paper variant='outlined' style={{ position: 'relative', height: '100%' }}>
        {schedules.map((schedule, index) =>
          <ScheduledMowing key={`schedule-${day}-${index}`} schedule={schedule} />,
        )}
      </Paper>
    </Grid>
  </Grid>
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
      height: '100%',
      paddingTop: appBarHeight,
    },
  }
})

const ScheduleDisplay = ({ schedule, onEditClick }) => {
  const schedulesForDay = (day, fullSchedule) => fullSchedule.filter(schedule => schedule.days[day])

  const classes = useStyles()

  return (
    <div style={{ height: '100%' }}>
      <AppBar className={classes.appBar} color='white' variant='outlined'>
        <Toolbar className={classes.appBar}>
          <Grid container justify='flex-end'>
            <Grid item><Button onClick={onEditClick} data-edit-schedule-button>Edit</Button></Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container direction='row' spacing={1} alignItems='stretch' className={classes.scheduleContainer}
            data-schedule-container>
        <Grid item xs><ScheduleColumn day={'monday'} schedules={schedulesForDay('monday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'tuesday'} schedules={schedulesForDay('tuesday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'wednesday'} schedules={schedulesForDay('wednesday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'thursday'} schedules={schedulesForDay('thursday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'friday'} schedules={schedulesForDay('friday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'saturday'} schedules={schedulesForDay('saturday', schedule)} /></Grid>
        <Grid item xs><ScheduleColumn day={'sunday'} schedules={schedulesForDay('sunday', schedule)} /></Grid>
      </Grid>
    </div>
  )
}