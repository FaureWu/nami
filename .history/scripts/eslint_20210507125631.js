const path = require('path')
const ejs = require('ejs')
const shell = require('shelljs')
const ora = require('ora')
const chalk = require('chalk')
const execSync = require('child_process').execSync
const file = require('../utils/file')

const packagePath = path.resolve(process.cwd(), 'package.json')

const packageJson = require(packagePath)

if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

packageJson.dependencies.eslint = '7.x'
packageJson.dependencies['eslint-plugin-vue'] = '7.x'
packageJson.dependencies['babel-eslint'] = '10.x'
packageJson.dependencies['eslint-config-cabinx'] = '1.x'
packageJson.dependencies['eslint-plugin-prettier'] = '3.x'
packageJson.dependencies.prettier = '2.x'
packageJson.dependencies.husky = '4.x'
packageJson.dependencies['lint-staged'] = '10.x'

if (!packageJson['lint-staged']) {
  packageJson['lint-staged'] = {}
}

packageJson['lint-staged']['dev/**/*.{js,scss}'] = [
  "eslint --fix ./dev",
  "git add ."
]
if (!packageJson.husky) {
  packageJson.husky = {}
}

if (!packageJson.husky.hooks) {
  packageJson.husky.hooks = {}
}

packageJson.husky.hooks['pre-commit'] = 'lint-staged'

function writeEslintIgnoreFile() {
  const files = file.readFilesDeep(process.cwd())
  const ignoreFileTemplate = file.readFileContent(path.resolve(__dirname, '../template/eslintignore.ejs'))
  const content = ejs.render(ignoreFileTemplate, { paths: files.map(f => {
    return f.replace(process.cwd(), '').replace(new RegExp(path.sep, 'g'), '/').replace('/', '')
  })})
  file.writeFileContent(path.resolve(process.cwd(), '.eslintignore'), content)
}

function writeEditorConfig() {
  const eslintrcTemplate = file.readFileContent(path.resolve(__dirname, '../template/eslintrc.ejs'))
  const content = ejs.render(eslintrcTemplate)
  file.writeFileContent(path.resolve(process.cwd(), '.eslintrc'), content)
}

function writePrettierrc() {
  const prettierTemplate = file.readFileContent(path.resolve(__dirname, '../template/prettierrc.ejs'))
  const content = ejs.render(prettierTemplate)
  file.writeFileContent(path.resolve(process.cwd(), '.prettierrc'), content)
}

function writePackage() {
  const content = JSON.stringify(packageJson)
  const json = file.prettierCode(content)
  file.writeFileContent(path.resolve(process.cwd(), 'package.json'), json)
}

function run() {
  const spin = ora('[Cabinx ESlint] 配置中同步中，请等待...').start()

  writeEslintIgnoreFile()
  writeEditorConfig()
  writePrettierrc()
  writePackage()

  console.log(`[Cabinx ESlint] ${chalk.green('配置同步成功!')}`)
  shell.exec('git config core.hooksPath ".git/hooks"')
  spin.stop()
  shell.exec('yarn install')

  shell.exec('git config core.hooksPath ".git/hooks"')
}

run()
