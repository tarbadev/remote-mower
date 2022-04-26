import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppBar, Grid, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { ScheduleColumn } from '../components/ScheduleColumn'
import { useSchedule } from '../../hooks/useSchedule'

export const Schedule = () => {
  const [schedule] = useSchedule()
  const history = useHistory()

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
        <Grid item xs><ScheduleColumn day={'monday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'tuesday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'wednesday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'thursday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'friday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'saturday'} schedule={schedule} /></Grid>
        <Grid item xs><ScheduleColumn day={'sunday'} schedule={schedule} /></Grid>
      </Grid>
    </div>
  )
}