'use strict'

const Test = require('tape')
const User = require('./user')

Test('create new user from google info', function (t) {
  t.plan(3)

  const userinfo = {
    email: 'ace@base.se',
    locale: 'en',
    picture: 'picture.com',
    given_name: 'Ace',
    family_name: 'Base',
    name: 'Ace Base',
    sub: '123456' // Google ID !
  }

  User.deleteUserByEmail(userinfo.email)
  .then(() => User.createOrUpdateUserFromGoogleInfo(userinfo))
  .then(user => {
    t.ok(user.new, 'Should have new prop')
    t.ok(user._id, 'Should have _id prop')
    t.equal(user.email, userinfo.email, 'Should have email prop')
  })
})

Test('update existing user from google info', function (t) {
  t.plan(2)

  const userinfo = { email: 'ace@base.se', sub: '123456' }
  User.createOrUpdateUserFromGoogleInfo(userinfo)
  .then(user => {
    t.ok(!user.new, 'Should not have new prop')
    t.equal(user.email, userinfo.email, 'Should have email prop')
  })
})
