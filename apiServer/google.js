'use strict'

const P = require('bluebird')
const Assert = require('assert')
const Https = require('https')
const Google = require('googleapis')

const OAuth2 = Google.auth.OAuth2
const Mongo = require('./mongodb')

const oauth2Client = new OAuth2(
  process.env.DONIAPP_GOOGLE_CLIENT_ID,
  process.env.DONIAPP_GOOGLE_CLIENT_SECRET,
  process.env.DONIAPP_GOOGLE_REDIRECT_URL
)

function request (url) {
  return new P((resolve, reject) => {
    console.log('Request:', url)
    Https.get(url, r => {
      console.log(`Got response: ${r.statusCode}`)
      let buffer = ''
      r.setEncoding('utf8')
      r.on('data', chunk => buffer += chunk)
      r.on('end', () => resolve(buffer))
    })
    .on('error', e => {
      console.log(`Got error: ${e.message}`)
      reject(e)
    })
  })
}

module.exports = function (app) {
  // Setup Google auth.
  function createUser (userinfo, googleApiTokens) {
    const user = {
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
      if (googleApiTokens) {
        yield db.collection('apiTokens').findOneAndUpdate(
          { userId: tokens.userId },
          { $set: tokens, $setOnInsert: { updated: new Date() } },
          { upsert: true }
        )
      }
    }
    return Mongo.query(_create, { user })
  }

  app.get('/google-auth', (req, res) => {
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

  app.post('/google-check-id-token', (req, res) => {
    return P.try(() => {
      Assert(req.body.idToken, 'missing idToken key')
      const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.idToken}`
      return request(url)
      .then(json => JSON.parse(json))
      .then(info => {
        console.log('Token info:', info)
        Assert(info && info.aud && info.aud === process.env.DONIAPP_GOOGLE_CLIENT_ID)
        // Create or update user.
        createUser(info)
        .then(() => res.json({ done: 'deal', info }))
      })
    })
    .catch(error => res.status(400).json({ error }))
  })

  app.get('/google-auth-callback', (req, res) => {
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
