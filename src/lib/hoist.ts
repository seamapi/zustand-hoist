import type { StoreApi } from 'zustand/vanilla'

import { hoistActions, type HoistedActionStoreApi } from './hoist-actions.js'
import { type HoistedStateStoreApi, hoistState } from './hoist-state.js'

export const hoist = <T extends StoreApi<any> = StoreApi<any>>(
  store: T
): T & HoistedStateStoreApi<T> & HoistedActionStoreApi<T> => {
  return hoistState(hoistActions(store))
}

export type HoistedStoreApi<T> = StoreApi<T> &
  HoistedStateStoreApi<T> &
  HoistedActionStoreApi<T>
