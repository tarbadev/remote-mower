import { useTranslation } from 'react-i18next'
import { Grid, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { ScheduledMowing } from '../pages/ScheduledMowing'

export const ScheduleColumn = ({ day, schedule = [] }) => {
  const { t } = useTranslation()
  const schedulesForDay = day => schedule.filter(schedule => schedule.days[day])
  const daySchedule = schedulesForDay(day)

  return <Grid container direction="column" style={{ height: '100%' }} alignContent="stretch">
    <Grid item>
      <Typography align="center" data-schedule-column-title>{t(`schedule.day.${day}`)}</Typography>
    </Grid>
    <Grid item style={{ flexGrow: 1 }}>
      <Paper variant="outlined" style={{ position: 'relative', height: '100%' }}>
        {daySchedule.map((schedule, index) =>
          <ScheduledMowing key={`schedule-${day}-${index}`} schedule={schedule} />,
        )}
      </Paper>
    </Grid>
  </Grid>
}