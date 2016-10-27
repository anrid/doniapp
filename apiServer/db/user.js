'use strict'

const Assert = require('assert')
const Mongo = require('../mongodb')

function deleteUserByEmail (email) {
  return Mongo.query(function * (db) {
    yield db.collection('users').deleteOne({ email })
  })
}

function createOrUpdateUserFromGoogleInfo (userinfo, googleApiTokens) {
  const data = {
    email: userinfo.email,
    locale: userinfo.locale,
    photo: userinfo.picture,
    givenName: userinfo.given_name,
    familyName: userinfo.family_name,
    name: userinfo.name,
    googleId: userinfo.sub,
    created: new Date(),
    updated: new Date()
  }

  return Mongo.query(function * (db) {
    Assert(data)
    Assert(data.email)

    let user = yield db.collection('users').findOne({ googleId: data.googleId })
    if (!user) {
      const result = yield db.collection('users').insertOne(data)
      user = result.ops[0]
      user.new = true
      console.log(`Created new user ${user.email} (${user._id.toString()})`)
    } else {
      console.log(`Found existing user ${user.email} (${user._id.toString()})`)
    }

    // Save Google access token if we have one.
    if (googleApiTokens) {
      const tokens = {
        userId: user._id,
        googleApiTokens
      }
      yield db.collection('apiTokens').findOneAndUpdate(
        { userId: user._id },
        { $set: tokens, $setOnInsert: { updated: new Date() } },
        { upsert: true }
      )
    }

    return user
  })
}

module.exports = {
  createOrUpdateUserFromGoogleInfo,
  deleteUserByEmail
}
