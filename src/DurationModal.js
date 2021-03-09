import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const DurationModal = ({ open, onClose, onSubmit, submitLabel }) => {
  const [durationType, setDurationType] = useState('hours')
  const [duration, setDuration] = useState(1)
  const { t } = useTranslation()

  const transformDurationToMinutes = () => {
    const tempDuration = duration * 60
    return durationType === 'days' ? tempDuration * 24 : tempDuration
  }

  return <Dialog open={open} onClose={onClose} data-duration-dialog>
    <DialogTitle>{t('home.menus.durationDialog.title')}</DialogTitle>
    <DialogContent>
      <Grid container alignItems='center'>
        <Grid item xs={6}>
          <TextField
            autoFocus
            label={t('home.menus.durationDialog.inputLabel')}
            type='number'
            value={duration}
            onChange={({ target }) => setDuration(target.value)}
            fullWidth
            data-duration-input
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            value={durationType}
            onChange={({ target }) => setDurationType(target.value)}
            data-duration-type
            fullWidth
          >
            <MenuItem value='hours' data-duration-dialog-hours>{t('home.menus.durationDialog.hours')}</MenuItem>
            <MenuItem value='days' data-duration-dialog-days>{t('home.menus.durationDialog.days')}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        {t('home.menus.durationDialog.cancel')}
      </Button>
      <Button onClick={() => onSubmit(transformDurationToMinutes())} color='primary' data-duration-submit>
        {submitLabel}
      </Button>
    </DialogActions>
  </Dialog>
}