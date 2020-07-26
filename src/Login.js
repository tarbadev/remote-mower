import React, { Suspense, useState } from 'react'
import { Button, Container, makeStyles, TextField, Typography } from '@material-ui/core'
import { login, LoginError } from './LoginService'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { useTranslation } from 'react-i18next'
import { Loader } from './Loader'

export const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onLoginError = error => {
    switch (error) {
      case LoginError.WRONG_LOGIN:
        setErrorMessage('wrongLogin')
        break
      case LoginError.NO_NETWORK:
        setErrorMessage('networkIssue')
        break
      default:
        setErrorMessage('other')
    }
  }

  return <Suspense fallback={<Loader />}>
    <LoginDisplay
      email={email}
      onEmailChange={(newEmail) => setEmail(newEmail)}
      password={password}
      onPasswordChange={(newPassword) => setPassword(newPassword)}
      submitForm={() => login(email, password, () => history.push('/'), onLoginError)}
      errorMessage={errorMessage}
      onErrorMessageButtonClose={() => setErrorMessage('')}
    />
  </Suspense>
}

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const LoginDisplay = ({ email, onEmailChange, password, onPasswordChange, submitForm, errorMessage, onErrorMessageButtonClose }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const submitFormCallback = event => {
    event.preventDefault()
    submitForm()
  }

  return (
    <Container maxWidth="xs" data-login-container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorMessage !== ''}
        autoHideDuration={5000}
        onClose={onErrorMessageButtonClose}>
        <Alert severity="error" onClose={onErrorMessageButtonClose}
               data-error-message>{errorMessage !== '' && t(`login.error.${errorMessage}`)}</Alert>
      </Snackbar>
      <div className={classes.loginContainer}>
        <Typography component='h1' variant='h5'>
          {t('login.title')}
        </Typography>
        <form className={classes.form} onSubmit={submitFormCallback}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label={t('login.emailLabel')}
            autoFocus
            data-email
            value={email}
            onChange={({ target }) => onEmailChange(target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label={t('login.passwordLabel')}
            type='password'
            value={password}
            onChange={({ target }) => onPasswordChange(target.value)}
            data-password
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            data-submit
            type='submit'
            onClick={submitFormCallback}
          >
            {t('login.submitLabel')}
          </Button>
        </form>
      </div>
    </Container>
  )
}