'use strict'

const Assert = require('assert')

const Token = require('./db/token')
const User = require('./db/user')

const serverData = {
  counter: 0
}

// The big ol’ topic to handler map.
const topicToActionMap = {
  'client:echo': handleEcho,
  'client:signout': handleSignout,
  'client:update:counter': handleServerUpdateCounter,
  'client:auth': handleAuth,
  'client:auth:token': handleAuthToken,
  'client:app:starter': handleAppStarter
}

function handleEcho (data, socket) {
  return serverMessage('echo', { echo: data }, socket)
}

function handleSignout (data, socket) {
  console.log('Perform signout:', data)
}

function setupSocket (server) {
  const io = require('socket.io')(server)
  io.on('connection', handleConnection)
}

function handleConnection (socket) {
  console.log(`Socket connected ${socket.id}`)

  // Emit a `welcome` message on connect.
  socket.emit('server:welcome', {
    serverToken: createServerToken()
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
}

function createServerToken () {
  return (Math.floor(Math.random() * 10000) + 10000) + '_' + Date.now()
}

function clientRequestError (error, socket) {
  socket.emit('clientRequestError', { error: error.message })
}

function serverMessage (topic, payload, socket) {
  socket.emit('serverMessage', { topic, payload })
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
  serverMessage('server:auth:successful', {
    identity: {
      email: 'ace@base.se',
      accessToken: '123456'
    }
  }, socket)
}

// Handle topic 'auth'
function handleAuthToken ({ token }, socket) {
  Token.checkAccessToken(token)
  .then(validToken => {
    return User.getUser(validToken.userId)
    .then(user => {
      serverMessage('server:auth:token:successful', {
        user,
        identity: User.createIdentity(user, validToken.token)
      }, socket)
    })
  })
  .catch(err => {
    console.error('handleAuthToken error:', err)
    serverMessage('server:auth:token:failed', { }, socket)
  })
}

// Handle topic 'app:starter'
function handleAppStarter (_, socket) {
  serverMessage('server:app:starter', {
    serverState: {
      some: 'data'
    }
  }, socket)
}

module.exports = {
  setupSocket
}
