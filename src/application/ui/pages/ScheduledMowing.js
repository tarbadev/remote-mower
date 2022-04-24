import { minuteToTimeString } from '../../Utils'
import { Divider, Grid, Paper, Typography } from '@material-ui/core'
import React from 'react'

export const ScheduledMowing = ({ schedule }) => {
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
    <Grid container direction="column" style={{ height: '100%' }}>
      <Grid item>
        <Typography align="center" style={{ color: '#333' }}>{beginTime}</Typography>
        <Divider />
      </Grid>
      <Grid item style={{ flexGrow: 1 }} />
      <Grid item>
        <Divider />
        <Typography align="center" style={{ color: '#333' }}>{endTime}</Typography>
      </Grid>
    </Grid>
  </Paper>
}