const path = require('path')

const packagePath = path.resolve(process.cwd(), 'package.json')

const packageJson = require(packagePath)

if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

packageJson.dependencies['eslint-config-cabinx'] = '1.0.0'
