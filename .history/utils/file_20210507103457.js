const fs = require('fs')
const path = require('path')

function isDirectory(dir) {
  return fs.statSync(dir).isDirectory()
}

function createReadFiles(mapper) {
  return function (dir) {
    if (!isDirectory(dir)) return []
    return fs.readdirSync(dir).reduce((files, fileName) => {
      const filePath = path.resolve(dir, fileName)
      const addFiles = isFunction(mapper) ? mapper(filePath) : filePath
      return files.concat(addFiles || [])
    }, [])
  }
}

const readFilesDeep = createReadFiles(filePath => {
  if (isDirectory(filePath)) return readFilesDeep(filePath)

  return filePath
})

module.exports = {
  readFilesDeep,
}