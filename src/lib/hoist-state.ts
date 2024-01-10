import type { StoreApi } from 'zustand/vanilla'

export const hoistState = <T extends StoreApi<any> = StoreApi<any>>(
  store: T,
): T & StateOnly<ReturnType<T['getState']>> => {
  const state = store.getState()

  for (const prop in state) {
    const value = state[prop]
    if (typeof value !== 'function') {
      Object.defineProperty(store, prop, {
        get: function () {
          return this.getState()[prop]
        },
      })
    }
  }

  return store as T & StateOnly<ReturnType<T['getState']>>
}

export type HoistedStateStoreApi<T> = StoreApi<T> & StateOnly<T>

type StateOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : T[K]
}
