#!/usr/bin/env node

const shell = require('shelljs')
const path = require('path')

const args = process.argv.slice(2)

const scripts = ['eslint']

const scriptIndex = args.findIndex(
  (x) => scripts.some(s => x),
)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]

if (scripts.some(s => s === script)) {
  const scriptFilePath = path.resolve(__dirname, `../scripts/${script}.js`)
  shell.exec(`node ${scriptFilePath} >>> null`)
}