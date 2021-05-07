const chalk = require('chalk')
const execSync = require('child_process').execSync

const args = process.argv.slice(2)

const scripts = ['eslint']

const scriptIndex = args.findIndex(
  (x) => scripts.some(s => x),
)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]

if (scripts.some(s => s === script)) {
  execSync(`node ./scripts/${script}.js`, { stdio: 'ignore' })
}