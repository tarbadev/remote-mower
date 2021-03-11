import { initialState } from './RootReducer'
import * as StoreProvider from './StoreProvider'
import { act } from 'react-dom/test-utils'

export const mockAppContext = () => {
  const context = { state: initialState, dispatch: jest.fn(), isUserLoggedIn: jest.fn() }

  jest
    .spyOn(StoreProvider, 'useAppContext')
    .mockImplementation(() => context)

  return context
}

export const waitForUpdate = async (wrapper) => {
  await act(async () => {
    await Promise.resolve(wrapper)
    await new Promise(resolve => setImmediate(resolve))
    wrapper.update()
  })
}