const fs = require('fs')
const path = require('path')
const os = require('os')
const prettier = require('prettier')

function prettierCode(code) {
  return prettier.format(code, {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: 'consistent',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'always',
    parser: 'json',
    endOfLine: 'lf',
  })
}

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

function readFileContent(filePath) {
  return fs
    .readFileSync(filePath)
    .toString()
}

function formatFilePath(filePath) {
  if (path.isAbsolute(filePath)) return filePath

  return `${path.sep}${filePath}`
}

function isFileExist(file) {
  return fs.existsSync(file)
}

function writeFileContent(filePath, content) {
  const fileParts = filePath.split(path.sep).filter(item => item)

  let i = os.type() === 'Windows_NT' ? 2 : 1
  for (; i < fileParts.length; i++) {
    const dir = formatFilePath(fileParts.slice(0, i).join(path.sep))
    if (isFileExist(dir)) continue
    fs.mkdirSync(dir)
  }

  fs.writeFileSync(filePath, content)
}

module.exports = {
  readFilesDeep,
  readFileContent,
  writeFileContent,
  prettierCode,
}