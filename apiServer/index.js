'use strict'

const Assert = require('assert')
const Path = require('path')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = 4002
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

const serverData = {
  counter: 0
}

server.listen(4002, () => console.log(`
  API server running.
  Port:    ${PORT}
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

app.get('/', function (req, res) {
  res.sendfile(Path.join(__dirname, '/index.html'))
})

function createServerToken () {
  return (Math.floor(Math.random() * 10000) + 10000) + '_' + Date.now()
}

io.on('connection', function (socket) {
  console.log(`Socket connected ${socket.id}`)

  // Emit a `welcome` message on connect.
  socket.emit('welcome', {
    serverToken: createServerToken(),
    serverVersion: VERSION
  })

  // Handle client requests.
  socket.on('clientRequest', (data, ack) => {
    try {
      console.log('Socket client request:', data)
      const { clientRequestId } = data
      // Acknowledge message immediately.
      if (ack && clientRequestId) {
        ack({ clientRequestId })
      }
      Assert(data, 'Missing data')
      Assert(data.topic, 'Missing data.topic')
      Assert(data.payload, 'Missing data.payload')

      const action = topicToActionMap[data.topic]
      if (!action) {
        throw new Error(`Unknown topic '${data.topic}'`)
      }
      action(data.payload, socket)
    } catch (error) {
      console.error('Error:', error)
      clientRequestError(error, socket)
    }
  })
})

function clientRequestError (error, socket) {
  socket.emit('clientRequestError', { error: error.message })
}

function serverMessage (topic, payload, socket) {
  socket.emit('serverMessage', { topic, payload })
}

// Big ol’ topic map !
const topicToActionMap = {
  'echo': (data, socket) => serverMessage('echo', { echo: data }, socket),
  'signout': (data, socket) => console.log('Perform signout:', data),
  'server:update:counter': handleServerUpdateCounter,
  'auth': handleAuth,
  'app:starter': handleAppStarter
}

// Just for fun.
function handleServerUpdateCounter ({ value }, socket) {
  serverData.counter += value
  serverMessage('server:update:counter', { value: serverData.counter }, socket)
}

// Handle topic 'auth'
function handleAuth ({ email, password }, socket) {
  console.log('Topic `auth`, email=', email, 'password=', password)

  if (email !== 'ace@base.se') {
    throw new Error('Unknown user')
  }
  serverMessage('auth:successful', {
    identity: {
      email: 'ace@base.se',
      accessToken: '123456'
    }
  }, socket)
}

// Handle topic 'app:starter'
function handleAppStarter (_, socket) {
  console.log('Topic `app:starter`')

  serverMessage('app:starter', {
    serverState: {
      some: 'data'
    }
  }, socket)
}
