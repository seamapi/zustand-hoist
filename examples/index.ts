#!/usr/bin/env tsx

import landlubber from 'landlubber'

import * as hoist from './hoist.js'

const commands = [hoist]

await landlubber(commands).parse()
