'use strict'

const Assert = require('assert')
const Path = require('path')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = 4002
const VERSION = process.env.npm_package_version

server.listen(4002, () => console.log(`
  API server running.
  Port:    ${PORT}
  Version: ${VERSION}
`))

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

const topicToActionMap = {
  'auth': handleAuth,
  'app:starter': handleAppStarter
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
