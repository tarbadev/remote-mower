import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppBar, Grid, Toolbar } from '@material-ui/core'
import { getMowerSchedule } from '../../../domain/MowerScheduleService'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { ScheduleColumn } from '../components/ScheduleColumn'

export const Schedule = () => {
  const [schedule, setSchedule] = useState([])
  const history = useHistory()

  useEffect(() => {
    getMowerSchedule().then(setSchedule)
  }, [])

  return <ScheduleDisplay schedule={schedule} onEditClick={() => history.push('/schedule/edit')} />
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
      height: '100%',
      paddingTop: appBarHeight,
    },
  }
})

const ScheduleDisplay = ({ schedule, onEditClick }) => {
  const { t } = useTranslation()
  const schedulesForDay = (day, fullSchedule) => fullSchedule.filter(schedule => schedule.days[day])

  const classes = useStyles()

  return (
    <div style={{ height: '100%' }}>
      <AppBar className={classes.appBar} variant='outlined'>
        <Toolbar className={classes.appBar}>
          <Grid container justify='flex-end'>
            <Grid item>
              <Button onClick={onEditClick} data-edit-schedule-button>
                {t('buttons.edit')}
              </Button>
            </Grid>
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