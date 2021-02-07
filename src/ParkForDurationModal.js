import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const ParkForDurationModal = ({ open, onClose, onSubmit }) => {
  const [durationType, setDurationType] = useState('hours')
  const [duration, setDuration] = useState(1)
  const { t } = useTranslation()

  const transformDurationToMinutes = () => {
    const tempDuration = duration * 60
    return durationType === 'days' ? tempDuration * 24 : tempDuration
  }

  return <Dialog open={open} onClose={onClose} data-park-duration-dialog>
    <DialogTitle>{t('home.menus.park.dialog.title')}</DialogTitle>
    <DialogContent>
      <Grid container alignItems='center'>
        <Grid item xs={6}>
          <TextField
            autoFocus
            label={t('home.menus.park.dialog.inputLabel')}
            type='number'
            value={duration}
            onChange={({ target }) => setDuration(target.value)}
            fullWidth
            data-park-duration-input
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            value={durationType}
            onChange={({ target }) => setDurationType(target.value)}
            data-park-duration-type
            fullWidth
          >
            <MenuItem value='hours' data-duration-dialog-hours>{t('home.menus.park.dialog.hours')}</MenuItem>
            <MenuItem value='days' data-duration-dialog-days>{t('home.menus.park.dialog.days')}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        {t('home.menus.park.dialog.cancel')}
      </Button>
      <Button onClick={() => onSubmit(transformDurationToMinutes())} color='primary' data-park-duration-submit>
        {t('home.menus.park.dialog.submit')}
      </Button>
    </DialogActions>
  </Dialog>
}