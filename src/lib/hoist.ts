import type { StoreApi } from 'zustand/vanilla'

type MethodsOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? T[K] : never
}

export const hoistMethods = <T extends StoreApi<any> = StoreApi<any>>(
  store: T
): T & MethodsOnly<ReturnType<T['getState']>> => {
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

  return newStore as T & MethodsOnly<ReturnType<T['getState']>>
}

export type HoistedMethodStoreApi<T> = StoreApi<T> & MethodsOnly<T>
