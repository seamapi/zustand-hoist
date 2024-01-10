import test from 'ava'
import { hoistState } from 'index.js'
import { createStore, type StoreApi } from 'zustand/vanilla'

test('hoistState: moves actions to top level', (t) => {
  const store = hoistState<StoreApi<State>>(
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

  store.getState().shaveDog()
  t.false(store.fur, 'has updated state')
})

test('hoistState: handles multiple state updates', (t) => {
  const store = hoistState<StoreApi<State>>(
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

  t.true(store.fur, 'has initial state')
  store.getState().shaveDog()
  t.false(store.fur, 'has updated state')
  store.getState().unshaveDog()
  t.true(store.fur, 'has next updated state')
  store.getState().shaveDog()
  store.getState().shaveDog()
  t.false(store.fur, 'has updated state two calls')
  store.getState().unshaveDog()
  store.getState().shaveDog()
  store.getState().shaveDog()
  store.getState().shaveDog()
  store.getState().unshaveDog()
  store.getState().shaveDog()
  store.getState().shaveDog()
  store.getState().unshaveDog()
  store.getState().unshaveDog()
  t.true(store.fur, 'has updated state after mutiple calls')
})

test('hoistState: handles action with arg', (t) => {
  const store = hoistState<StoreApi<State>>(
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

  t.true(store.snout, 'has initial state')
  t.false(store.getState().boopSnoot(false), 'returns new state on update')
  t.false(store.snout, 'has updated state')
  t.true(store.getState().boopSnoot(true), 'returns new state on second update')
  t.true(store.getState().boopSnoot(true), 'returns new state on third update')
  t.true(store.snout, 'has final updated state')
})

interface State {
  paw: boolean
  snout: boolean
  fur: boolean
  shaveDog: () => void
  unshaveDog: () => void
  boopSnoot: (sount: boolean) => boolean
}
