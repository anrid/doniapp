'use strict'

const Test = require('tape')
const Token = require('./token')

Test('something nice', function (t) {
  t.plan(1)
  t.ok(1 + 1 === 2, 'Duh')
})

Test.onFinish(() => {
  console.log('.. and we’re done.')
  require('../mongodb').close()
})
