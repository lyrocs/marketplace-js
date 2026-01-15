import edge from 'edge.js'
import env from '#start/env'

edge.global('env', (key: string) => env.get(key))
