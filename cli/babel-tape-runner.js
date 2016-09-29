#!/usr/bin/env node

require('babel-register')
require('babel-polyfill')

const Path = require('path')
const Glob = require('glob')

process.argv.slice(2).forEach(function (arg) {
  Glob(arg, (err, files) => {
    if (err) throw err
    files.forEach(function (file) {
      require(Path.resolve(process.cwd(), file))
    })
  })
})
