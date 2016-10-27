'use strict'

const P = require('bluebird')
const Assert = require('assert')
const Https = require('https')
const Google = require('googleapis')

const OAuth2 = Google.auth.OAuth2

const User = require('./db/user')

const oauth2Client = new OAuth2(
  process.env.DONIAPP_GOOGLE_CLIENT_ID,
  process.env.DONIAPP_GOOGLE_CLIENT_SECRET,
  process.env.DONIAPP_GOOGLE_REDIRECT_URL
)

function request (url) {
  return new P((resolve, reject) => {
    console.log('Request:', url.substr(0, 128))
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
        Assert(info && info.aud, 'Missing aud key')
        Assert(info.aud === process.env.DONIAPP_GOOGLE_CLIENT_ID, 'Google client id mismatch')
        console.log(`Got token info for ${info.name} (${info.email}).`)
        // Create or update user.
        return User.createOrUpdateUserFromGoogleInfo(info)
        .then(result => res.json(result))
      })
    })
    .catch(error => {
      res.status(400).send(error.message)
    })
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
    .then(({ userinfo, tokens }) => User.createOrUpdateUserFromGoogleInfo(userinfo, tokens))
    .then(() => res.status(200).send('Done.'))
    .catch(err => {
      console.error('Catch:', err)
      res.status(400).send(`Error: ${err}`)
    })
  })
}
