import { useTranslation } from 'react-i18next'
import { Grid, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { ScheduledMowing } from '../pages/ScheduledMowing'

export const ScheduleColumn = ({ day, schedules = [] }) => {
  const { t } = useTranslation()

  return <Grid container direction="column" style={{ height: '100%' }} alignContent="stretch">
    <Grid item>
      <Typography align="center">{t(`schedule.day.${day}`)}</Typography>
    </Grid>
    <Grid item style={{ flexGrow: 1 }}>
      <Paper variant="outlined" style={{ position: 'relative', height: '100%' }}>
        {schedules.map((schedule, index) =>
          <ScheduledMowing key={`schedule-${day}-${index}`} schedule={schedule} />,
        )}
      </Paper>
    </Grid>
  </Grid>
}