import React, { createContext, useContext, useReducer } from 'react'
import { initialState, reducer } from './RootReducer'
import { applyMiddleware, fetchAction } from './AppMiddleware'
import PropTypes from 'prop-types'
import { retrieveToken } from './LoginRepository'

export const useActions = (state, dispatch)  => ({
  fetch: data => dispatch(fetchAction(data)),
})

const StoreContext = createContext(initialState)

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const enhancedDispatch = applyMiddleware(dispatch)
  const actions = useActions(state, enhancedDispatch)

  const isUserLoggedIn = async () => await retrieveToken() != null

  return (
    <StoreContext.Provider value={{
      state,
      dispatch: enhancedDispatch,
      actions,
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