'use strict'

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
    console.log('Socket client request:', data)
    const { clientRequestId } = data
    // Acknowledge message immediately.
    if (ack && clientRequestId) {
      ack({ clientRequestId })
    }
  })
})
