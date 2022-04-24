import React, { createContext, useContext } from 'react'
import { initialState } from './RootReducer'
import PropTypes from 'prop-types'
import { retrieveToken } from '../infrastructure/LoginRepository'

const StoreContext = createContext(initialState)

export const StoreProvider = ({ children }) => {
  const isUserLoggedIn = async () => await retrieveToken() != null

  return (
    <StoreContext.Provider value={{
      isUserLoggedIn,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useAppContext = () => useContext(StoreContext)

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
}