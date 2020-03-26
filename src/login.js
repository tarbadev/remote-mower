import React from 'react'
import { Button, Container, TextField, Typography, makeStyles } from '@material-ui/core'

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

export const Login = () => {
  return <LoginDisplay />
}

const LoginDisplay = () => {
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
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}