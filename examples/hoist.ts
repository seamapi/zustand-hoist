import type { Builder, Command, Describe, Handler } from 'landlubber'
import { createStore } from 'zustand/vanilla'

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
  const store = hoistMethods(
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
