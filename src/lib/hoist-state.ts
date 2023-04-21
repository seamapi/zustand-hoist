import type { StoreApi } from 'zustand/vanilla'

export const hoistState = <T extends StoreApi<any> = StoreApi<any>>(
  store: T
): T & StateOnly<ReturnType<T['getState']>> => {
  const state = store.getState()
  const keys = Object.keys(state)

  const newStore = keys.reduce((prevStore, key) => {
    const value = state[key]
    if (typeof value === 'function') return prevStore
    return {
      ...prevStore,
      get [key]() {
        return store.getState()[key]
      }
    }
  }, store)

  return newStore as T & StateOnly<ReturnType<T['getState']>>
}

export type HoistedStateStoreApi<T> = StoreApi<T> & StateOnly<T>

type StateOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : T[K]
}
