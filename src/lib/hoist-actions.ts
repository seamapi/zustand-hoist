import { type StoreApi } from 'zustand/vanilla'

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

type ActionsOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? T[K] : never
}
