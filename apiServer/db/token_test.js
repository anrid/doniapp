'use strict'

const Test = require('tape')
const Token = require('./token')

const TEST_USER_ID = '580000000000000000000000'

Test('create a token', function (t) {
  t.plan(2)

  Token.deleteTokensForUser(TEST_USER_ID)
  .then(() => Token.createAccessTokenForUser(TEST_USER_ID))
  .then(token => {
    t.ok(token, 'Should create a new access token')
    t.equal(token.length, 128, 'Should be 128 chars long')
  })
})

Test('check valid token', function (t) {
  t.plan(2)

  Token.getRecentAccessToken(TEST_USER_ID)
  .then(token => {
    return Token.checkAccessToken(token)
    .then(validToken => {
      t.ok(token && validToken, 'Should find two tokens')
      t.equal(token, validToken.token, 'Should get the same tokens')
    })
  })
})

Test.onFinish(() => {
  console.log('.. and we’re done.')
  require('../mongodb').close()
})
