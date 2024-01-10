import type { StoreApi } from 'zustand/vanilla'

export const hoistActions = <T extends StoreApi<any> = StoreApi<any>>(
  store: T,
): T & ActionsOnly<ReturnType<T['getState']>> => {
  const state = store.getState()

  for (const prop in state) {
    const value = state[prop]
    if (typeof value === 'function') {
      Object.defineProperty(store, prop, {
        value: function (...args: Parameters<typeof value>) {
          return this.getState()[prop](...args)
        },
      })
    }
  }

  return store as T & ActionsOnly<ReturnType<T['getState']>>
}

export type HoistedActionStoreApi<T> = StoreApi<T> & ActionsOnly<T>

type ActionsOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? T[K] : never
}
