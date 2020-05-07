import React, { useEffect, useState } from 'react'
import { useAppContext } from './StoreProvider'
import { Redirect } from 'react-router-dom'

export const Home = () => {
  const [userLoggedIn, setUserLoggedIn] = useState()
  const { isUserLoggedIn } = useAppContext()

  useEffect(() => {
    const getDataFromStorage = async () => {
      const loggedIn = await isUserLoggedIn()
      setUserLoggedIn(loggedIn)
    }
    getDataFromStorage()
  }, [isUserLoggedIn])

  return <HomeDisplay userLoggedIn={userLoggedIn} />
}

const HomeDisplay = ({userLoggedIn}) => {
  if (userLoggedIn == null) {
    return <div />
  } else if (userLoggedIn) {
    return <div data-home-container>Home</div>
  } else {
    return <Redirect to='/login' />
  }
}