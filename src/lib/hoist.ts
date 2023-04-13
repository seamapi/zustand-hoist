import type { StoreApi } from 'zustand/vanilla'

type MethodsOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? T[K] : never
}

export const hoistMethods = <T extends StoreApi<any> = StoreApi<any>>(
  store: T
): T & MethodsOnly<ReturnType<T['getState']>> => {
  const state = store.getState()
  for (const key in state) {
    if (typeof state[key] === 'function') {
      const method = state[key]
      store[key] = (...args: Parameters<typeof method>) => method(...args)
    }
  }
  return store
}
