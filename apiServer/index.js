'use strict'

const Assert = require('assert')
const Path = require('path')
const Fs = require('fs')

const app = require('express')()
const server = require('http').Server(app)

Assert(process.env.DONIAPP_HOST, 'Missing env `DONIAPP_HOST`')
Assert(process.env.DONIAPP_PORT, 'Missing env `DONIAPP_PORT`')
Assert(process.env.DONIAPP_CDN, 'Missing env `DONIAPP_CDN`')

const VERSION = process.env.npm_package_version

// Setup collections and indexes.
const Mongo = require('./mongodb')
Mongo.query(function * (db) {
  const index1 = yield db.ensureIndex('users', { email: 1 }, { unique: true, background: true })
  const index2 = yield db.ensureIndex('users', { googleId: 1 }, { unique: true, background: true })
  const index3 = yield db.ensureIndex('apiTokens', { userId: 1 }, { unique: true, background: true })
  const index4 = yield db.ensureIndex('accessTokens', { token: 1 }, { unique: true, background: true })
  const index5 = yield db.ensureIndex('accessTokens', { userId: 1 }, { background: true })
  console.log('Ensure index:', [index1, index2, index3, index4, index5])
})

server.listen(process.env.DONIAPP_PORT, () => console.log(`
  API server running.
  Port:    ${process.env.DONIAPP_PORT}
  Version: ${VERSION}
`))

// CORS setup.
const cors = require('cors')
app.use(cors())
app.options('*', cors())

// Body parser setup.
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Setup routes AFTER all the low-level middleware !
require('./google')(app)

const indexHtml = Fs.readFileSync(Path.join(__dirname, '/index.html'), 'utf8')
app.get('/', function (req, res) {
  const manifest = require('../build/manifest.json')
  let html = indexHtml
  .replace(/@HOST/g, process.env.DONIAPP_HOST)
  .replace(
    /@SOCKET/g,
    process.env.DONIAPP_HOST.replace('https', 'wss').replace('http', 'ws')
  )
  .replace(/@BUNDLE/g, `${process.env.DONIAPP_CDN}/${manifest['app.js']}`)
  .replace(/@GOOGLE_CLIENT_ID/, process.env.DONIAPP_GOOGLE_CLIENT_ID)
  res.send(html)
})

// Setup socket.
require('./socket').setupSocket(server)
