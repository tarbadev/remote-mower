import React, { useState } from 'react'
import { Button, Container, makeStyles, TextField, Typography } from '@material-ui/core'
import { useAppContext } from './StoreProvider'
import { login } from './LoginService'

export const Login = ({history}) => {
  const { dispatch } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return <LoginDisplay
    email={email}
    onEmailChange={(newEmail) => setEmail(newEmail)}
    password={password}
    onPasswordChange={(newPassword) => setPassword(newPassword)}
    onSubmitButtonClicked={() => dispatch(login(email, password, () => history.push('/home')))}
  />
}

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    marginTop: theme.spacing(8),
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

const LoginDisplay = ({ email, onEmailChange, password, onPasswordChange, onSubmitButtonClicked }) => {
  const classes = useStyles()
  return (
    <Container maxWidth="xs">
      <div className={classes.loginContainer}>
        <Typography component='h1' variant='h5'>
          Log in
        </Typography>
        <form className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Email Address'
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
            label='Password'
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
            onClick={onSubmitButtonClicked}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}