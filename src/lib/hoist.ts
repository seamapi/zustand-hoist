import type { StoreApi } from 'zustand/vanilla'

type StateOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : T[K]
}

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

  return newStore as T & ActionsOnly<ReturnType<T['getState']>>
}

export type HoistedStateStoreApi<T> = StoreApi<T> & StateOnly<T>

type ActionsOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? T[K] : never
}

export const hoistActions = <T extends StoreApi<any> = StoreApi<any>>(
  store: T
): T & ActionsOnly<ReturnType<T['getState']>> => {
  const state = store.getState()
  const keys = Object.keys(state)

  const newStore = keys.reduce((prevStore, key) => {
    const value = state[key]
    if (typeof value !== 'function') return prevStore
    return {
      ...prevStore,
      [key]: (...args: Parameters<typeof value>) => value(...args)
    }
  }, store)

  return newStore as T & ActionsOnly<ReturnType<T['getState']>>
}

export type HoistedActionStoreApi<T> = StoreApi<T> & ActionsOnly<T>
