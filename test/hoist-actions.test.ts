import test from 'ava'
import { createStore, type StoreApi } from 'zustand/vanilla'

import { hoistActions } from 'zustand-hoist'

test('hoistActions: moves actions to top level', (t) => {
  const store = hoistActions<StoreApi<State>>(
    createStore((set, get) => ({
      paw: true,
      snout: true,
      fur: true,
      shaveDog() {
        set({ fur: false })
      },
      unshaveDog() {
        set({ fur: true })
      },
      boopSnoot(snout: boolean) {
        set({ snout })
        return get().snout
      },
    })),
  )

  t.like(
    store.getState(),
    {
      paw: true,
      snout: true,
      fur: true,
    },
    'has initial state',
  )

  store.shaveDog()
  t.false(store.getState().fur, 'has updated state')
})

test('hoistActions: handles multiple state updates', (t) => {
  const store = hoistActions<StoreApi<State>>(
    createStore((set, get) => ({
      paw: true,
      snout: true,
      fur: true,
      shaveDog() {
        set({ fur: false })
      },
      unshaveDog() {
        set({ fur: true })
      },
      boopSnoot(snout: boolean) {
        set({ snout })
        return get().snout
      },
    })),
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

test('hoistActions: handles action with arg', (t) => {
  const store = hoistActions<StoreApi<State>>(
    createStore((set, get) => ({
      paw: true,
      snout: true,
      fur: true,
      shaveDog() {
        set({ fur: false })
      },
      unshaveDog() {
        set({ fur: true })
      },
      boopSnoot(snout: boolean) {
        set({ snout })
        return get().snout
      },
    })),
  )

  t.true(store.getState().snout, 'has initial state')
  t.false(store.boopSnoot(false), 'returns new state on update')
  t.false(store.getState().snout, 'has updated state')
  t.true(store.boopSnoot(true), 'returns new state on second update')
  t.true(store.boopSnoot(true), 'returns new state on third update')
  t.true(store.getState().snout, 'has final updated state')
})

interface State {
  paw: boolean
  snout: boolean
  fur: boolean
  shaveDog: () => void
  unshaveDog: () => void
  boopSnoot: (sount: boolean) => boolean
}
