'use strict'

const P = require('bluebird')
const Assert = require('assert')
const Google = require('googleapis')
const OAuth2 = Google.auth.OAuth2
const Mongo = require('./mongodb')

const oauth2Client = new OAuth2(
  process.env.DONIAPP_GOOGLE_CLIENT_ID,
  process.env.DONIAPP_GOOGLE_CLIENT_SECRET,
  process.env.DONIAPP_GOOGLE_REDIRECT_URL
)

module.exports = function (app) {
  // Setup Google auth.
  function createUser (userinfo, googleApiTokens) {
    const user = {
      email: userinfo.email,
      link: userinfo.link,
      locale: userinfo.locale,
      gender: userinfo.gender,
      photo: userinfo.picture,
      givenName: userinfo.given_name,
      familyName: userinfo.family_name,
      name: userinfo.name,
      googleId: userinfo.id,
      created: new Date(),
      updated: new Date()
    }

    function * _create (db, opts) {
      Assert(user)
      Assert(user.email)
      const tokens = { googleApiTokens }
      const existing = yield db.collection('users').findOne({ googleId: user.googleId })
      if (!existing) {
        const res1 = yield db.collection('users').insertOne(user)
        tokens.userId = res1.insertedId
        console.log(`Created new user ${user.email} (${tokens.userId.toString()})`)
      } else {
        tokens.userId = existing._id
        console.log(`Found existing user ${existing.email} (${tokens.userId.toString()})`)
      }
      yield db.collection('apiTokens').findOneAndUpdate(
        { userId: tokens.userId },
        { $set: tokens, $setOnInsert: { updated: new Date() } },
        { upsert: true }
      )
    }
    return Mongo.query(_create, { user })
  }

  app.get('/google-auth', function (req, res) {
    Assert(process.env.DONIAPP_GOOGLE_CLIENT_ID)
    Assert(process.env.DONIAPP_GOOGLE_CLIENT_SECRET)
    Assert(process.env.DONIAPP_GOOGLE_REDIRECT_URL)
    const scopes = [
      'https://www.googleapis.com/auth/plus.me',
      'email'
    ]
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
      scope: scopes // If you only need one scope you can pass it as string
    })
    res.redirect(302, url)
  })

  app.get('/google-auth-callback', function (req, res) {
    return new P((resolve, reject) => {
      const code = req.query.code
      oauth2Client.getToken(code, (err, tokens) => {
        // Now tokens contains an access_token and an optional refresh_token. Save them !
        if (err) {
          return reject(err)
        }
        // console.log('Tokens:', tokens)
        oauth2Client.setCredentials(tokens)
        resolve(tokens)
      })
    })
    .then(tokens => {
      return new P((resolve, reject) => {
        Google.oauth2('v2').userinfo.get(
          { auth: oauth2Client },
          (err, userinfo) => {
            if (err) {
              return reject(err)
            }
            resolve({ userinfo, tokens })
          }
        )
      })
    })
    .then(({ userinfo, tokens }) => createUser(userinfo, tokens))
    .then(() => res.status(200).send('Done.'))
    .catch(err => {
      console.error('Catch:', err)
      res.status(400).send(`Error: ${err}`)
    })
  })
}
