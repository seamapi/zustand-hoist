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
      },
      unshaveDog() {
        set({ fur: true })
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

test('hoistMethods: handles multiple state updates', (t) => {
  const store = hoistMethods<StoreApi<State & Methods>>(
    createStore((set) => ({
      paw: true,
      snout: true,
      fur: true,
      shaveDog() {
        set({ fur: false })
      },
      unshaveDog() {
        set({ fur: true })
      }
    }))
  )

  t.true(store.getState().fur, 'has initial state')
  store.shaveDog()
  t.false(store.getState().fur, 'has updated state')
  store.unshaveDog()
  t.true(store.getState().fur, 'has next updated state')
  store.shaveDog()
  store.shaveDog()
  t.false(store.getState().fur, 'has updated state two calls')
  store.unshaveDog()
  store.shaveDog()
  store.shaveDog()
  store.shaveDog()
  store.unshaveDog()
  store.shaveDog()
  store.shaveDog()
  store.unshaveDog()
  store.unshaveDog()
  t.true(store.getState().fur, 'has updated state after mutiple calls')
})

interface State {
  paw: boolean
  snout: boolean
  fur: boolean
}

interface Methods {
  shaveDog: () => void
  unshaveDog: () => void
}
