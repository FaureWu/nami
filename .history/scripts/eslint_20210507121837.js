const path = require('path')
const ejs = require('ejs')
const file = require('../utils/file')
const execSync = require('child_process').execSync

const packagePath = path.resolve(process.cwd(), 'package.json')

const packageJson = require(packagePath)

if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

packageJson.dependencies.eslint = '7.25.0'
packageJson.dependencies['eslint-config-cabinx'] = '1.0.0'
packageJson.dependencies.husky = '4.3.8'
packageJson.dependencies['lint-staged'] = '10.5.4'

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
  writeEslintIgnoreFile()
  writeEditorConfig()
  writePrettierrc()
  writePackage()

  console.log('cabinx eslint配置生成成功')
  console.log('执行如下命令安装依赖：')

  console.log('$ yarn')
}

run()
