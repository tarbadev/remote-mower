import { initialState } from './RootReducer'
import * as StoreProvider from './StoreProvider'

export const mockAppContext = () => {
  const context = { state: initialState, dispatch: jest.fn(), isUserLoggedIn: jest.fn() }

  jest
    .spyOn(StoreProvider, 'useAppContext')
    .mockImplementation(() => context)

  return context
}