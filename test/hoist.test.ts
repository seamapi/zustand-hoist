import test from 'ava'
import { createStore, type StoreApi } from 'zustand/vanilla'

import { hoistMethods } from 'index.js'

test('hoistMethods: moves methods to top level', (t) => {
  const store = hoistMethods<StoreApi<State & Methods>>(
    createStore((set) => ({
      paw: true,
      snout: true,
      fur: true,
      shaveDog() {
        set({ fur: false })
      }
    }))
  )

  t.like(
    store.getState(),
    {
      paw: true,
      snout: true,
      fur: true
    },
    'has initial state'
  )

  store.shaveDog()
  t.false(store.getState().fur, 'has updated state')
})

interface State {
  paw: boolean
  snout: boolean
  fur: boolean
}

interface Methods {
  shaveDog: () => void
}
