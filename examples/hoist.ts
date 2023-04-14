import type { Builder, Command, Describe, Handler } from 'landlubber'
import { createStore, type StoreApi } from 'zustand/vanilla'

import { hoistMethods } from 'index.js'

interface Options {
  name: string
}

export const command: Command = 'hoist name'

export const describe: Describe = 'Set value with hoisted method'

export const builder: Builder = {
  name: {
    type: 'string',
    describe: 'Name to set in state'
  }
}

export const handler: Handler<Options> = async ({ name, logger }) => {
  const store = hoistMethods<StoreApi<State>>(
    createStore((set) => ({
      name: '',
      setName() {
        set({ name })
      }
    }))
  )
  store.setName(name)
  logger.info({ state: store.getState() }, 'Hoisted')
}

interface State {
  name: string
  setName: (name: string) => void
}
