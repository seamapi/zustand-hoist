import type { StoreApi } from 'zustand/vanilla'

import { hoistActions } from './hoist-actions.js'
import { hoistState } from './hoist-state.js'

export const hoist = <T extends StoreApi<any> = StoreApi<any>>(
  store: T,
): T & ReturnType<T['getState']> => {
  return hoistState(hoistActions(store)) as T & ReturnType<T['getState']>
}

export type HoistedStoreApi<T> = StoreApi<T> & T
