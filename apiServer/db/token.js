'use strict'

const Assert = require('assert')
const Crypto = require('crypto')
const Mongo = require('../mongodb')

function checkAccessToken (token) {
  return Mongo.query(function * (db) {
    const t = yield db.collection('accessTokens').findOne({
      token,
      expires: { $gt: new Date() }
    })
    Assert(t, 'Invalid token')
    return t
  })
}

function createToken (salt) {
  const hash = Crypto.createHash('sha512')
  hash.update(Crypto.randomBytes(256).toString('hex') + salt)
  return hash.digest('hex')
}

function createAccessTokenForUser (userId) {
  const token = createToken(process.env.DONIAPP_GOOGLE_CLIENT_SECRET)
  return Mongo.query(function * (db) {
    yield db.collection('accessTokens').insertOne({
      token,
      userId: Mongo.getObjectId(userId),
      created: new Date(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days.
    })
    return token
  })
}

function getRecentAccessToken (userId) {
  return Mongo.query(function * (db) {
    const existing = yield db.collection('accessTokens')
    .findOne({ userId: Mongo.getObjectId(userId) }, { limit: 1, sort: { _id: -1 } })
    if (!existing) {
      return yield createAccessTokenForUser(userId)
    }
    return existing.token
  })
}

function deleteTokensForUser (userId) {
  return Mongo.query(function * (db) {
    const res = yield db.collection('accessTokens')
    .deleteMany({ userId: Mongo.getObjectId(userId) })
    return res.n
  })
}

module.exports = {
  createToken,
  createAccessTokenForUser,
  getRecentAccessToken,
  checkAccessToken,
  deleteTokensForUser
}
