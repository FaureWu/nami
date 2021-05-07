const args = process.argv.slice(2)

const scripts = ['eslint']

const scriptIndex = args.findIndex(
  (x) => scripts.some(s => x),
)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

if (['eslint'].indexOf(script))