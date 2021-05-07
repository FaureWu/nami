const path = require('path')
const file = require('../utils/file')

const packagePath = path.resolve(process.cwd(), 'package.json')

const packageJson = require(packagePath)

if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

packageJson.dependencies['eslint-config-cabinx'] = '1.0.0'
if (!packageJson['lint-staged']) {
  packageJson['lint-staged'] = {}
}

packageJson['lint-staged']['./dev/**/*.{js,scss}'] = [
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
}

const files = file.readFilesDeep(process.cwd())
