import React, { useEffect, useState } from 'react'
import { AppBar, Box, Card, Fab, Grid, Toolbar, Typography } from '@material-ui/core'
import { getMowerSchedule, setMowerSchedule } from '../../../domain/MowerScheduleService'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { minuteToTimeString } from '../../Utils'
import { useTranslation } from 'react-i18next'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

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
      const schedulesCopy = [...schedules.filter((_, indexCopy) => index !== indexCopy)]
      setSchedules(schedulesCopy)
    }}
    onSaveClick={() => setMowerSchedule(schedules).then(loadSchedules)}
    onAddButtonClick={() => setSchedules([
      ...schedules,
      {
        start: 0,
        duration: 1439,
        days: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
      },
    ])}
    onSchedulesUpdated={newSchedules => {
      setSchedules([...newSchedules])
    }}
  />
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
      cursor: 'pointer',
    },
    timeContainer: {
      color: '#333',
    },
    time: {
      fontWeight: 'bold',
      color: '#e57373',
      cursor: 'pointer',
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
  }
})

const ScheduleCardDay = ({ day, schedule, onDayClick }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const className = schedule.days[day] ? `${classes.selectedDay} ${classes.day}` : classes.day

  return <Grid item xs>
    <Typography className={className} align='center' onClick={onDayClick}
                data-edit-schedule-day={day}>{t(`schedule.day.${day}`)}</Typography>
  </Grid>
}

const ScheduleCard = ({ schedule, onDeleteButtonClick, onScheduleUpdated }) => {
  const classes = useStyles()
  const beginTime = minuteToTimeString(schedule.start)
  const endTime = minuteToTimeString(schedule.start + schedule.duration)
  const [beginDate, setBeginDate] = useState(new Date(`2020-01-01T${beginTime}`))
  const [endDate, setEndDate] = useState(new Date(`2020-01-01T${endTime}`))

  useEffect(() => {
    const beginTime = minuteToTimeString(schedule.start)
    const endTime = minuteToTimeString(schedule.start + schedule.duration)
    setBeginDate(new Date(`2020-01-01T${beginTime}`))
    setEndDate(new Date(`2020-01-01T${endTime}`))
  }, [schedule])

  const onDayClick = (day) => {
    schedule.days[day] = !schedule.days[day]
    onScheduleUpdated(schedule)
  }

  const onStartTimeChange = (newDate) => {
    setBeginDate(newDate)
    schedule.start = newDate.getHours() * 60 + newDate.getMinutes()
    onScheduleUpdated(schedule)
  }

  const onEndTimeChange = (newDate) => {
    setEndDate(newDate)
    schedule.duration = newDate.getHours() * 60 + newDate.getMinutes() - schedule.start
    onScheduleUpdated(schedule)
  }

  return <Card data-schedule-card>
    <Box paddingY={2} paddingX={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} container justify='space-between' alignItems='center'>
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Typography variant='h5' className={classes.timeContainer}>
                <TimePicker
                  autoOk
                  ampm={false}
                  TextFieldComponent={({ value, onClick }) => <span onClick={onClick}
                                                                    className={classes.time}>{value}</span>}
                  value={beginDate}
                  onChange={onStartTimeChange}
                />
                &nbsp;-&nbsp;
                <TimePicker
                  autoOk
                  ampm={false}
                  TextFieldComponent={({ value, onClick }) => <span onClick={onClick}
                                                                    className={classes.time}>{value}</span>}
                  value={endDate}
                  onChange={onEndTimeChange}
                />
              </Typography>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <IconButton onClick={onDeleteButtonClick} data-delete-schedule-button><DeleteIcon /></IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1}>
          <ScheduleCardDay schedule={schedule} day='monday' onDayClick={() => onDayClick('monday')} />
          <ScheduleCardDay schedule={schedule} day='tuesday' onDayClick={() => onDayClick('tuesday')} />
          <ScheduleCardDay schedule={schedule} day='wednesday' onDayClick={() => onDayClick('wednesday')} />
          <ScheduleCardDay schedule={schedule} day='thursday' onDayClick={() => onDayClick('thursday')} />
          <ScheduleCardDay schedule={schedule} day='friday' onDayClick={() => onDayClick('friday')} />
          <ScheduleCardDay schedule={schedule} day='saturday' onDayClick={() => onDayClick('saturday')} />
          <ScheduleCardDay schedule={schedule} day='sunday' onDayClick={() => onDayClick('sunday')} />
        </Grid>
      </Grid>
    </Box>
  </Card>
}

const EditScheduleDisplay = ({
  schedules,
  onBackClick,
  removeSchedule,
  onSaveClick,
  onAddButtonClick,
  onSchedulesUpdated,
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div style={{ height: '100%' }}>
      <AppBar className={classes.appBar} variant='outlined'>
        <Toolbar className={classes.appBar}>
          <Grid container justify='space-between'>
            <Grid item>
              <Button onClick={onBackClick}>
                {t('buttons.back')}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={onSaveClick} data-schedule-save-button>
                {t('buttons.save')}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container direction='row' spacing={1} className={classes.scheduleContainer}
            data-edit-schedule-container>
        {schedules.map((schedule, index) =>
          <Grid key={`schedule-card-${index}`} item xs={12}>
            <ScheduleCard
              schedule={schedule}
              onDeleteButtonClick={() => removeSchedule(index)}
              onScheduleUpdated={newSchedule => {
                schedules[index] = newSchedule
                onSchedulesUpdated(schedules)
              }}
            />
          </Grid>)}
      </Grid>
      <Fab color='primary' onClick={onAddButtonClick} className={classes.fab} data-schedule-add-button>
        <AddIcon />
      </Fab>
    </div>
  )
}