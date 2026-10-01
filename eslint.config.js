import defaults from './src/index.js'

export default [
  ...defaults,
  { ignores: ['**/.*', '**/dist/', '!.projenrc.ts'] },
]
