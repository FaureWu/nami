const path = require('path')
const ejs = require('ejs')
const shell = require('shelljs')
const ora = require('ora')
const chalk = require('chalk')
const execSync = require('child_process').execSync
const file = require('../utils/file')

function writeEslintIgnoreFile() {
  const files = file.readCabinXMobileDeep(process.cwd())
  const ignoreFileTemplate = file.readFileContent(path.resolve(__dirname, '../template/eslintignore.ejs'))
  const content = ejs.render(ignoreFileTemplate, { paths: files.map(f => {
    return f.replace(process.cwd(), '').replace(new RegExp('\\' + path.sep, 'g'), '/').replace('/', '')
  })})
  file.writeFileContent(path.resolve(process.cwd(), '.eslintignore'), content)
}

function run() {
  const spin = ora('[Cabinx ESlint] 配置同步中，请等待...').start()

  writeEslintIgnoreFile()

  console.log(`- [Cabinx ESlint] ${chalk.green('配置同步成功!')}`)
  spin.stop()
}

run()