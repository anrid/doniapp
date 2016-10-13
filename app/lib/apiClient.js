'use strict'

const STORAGE_KEY = '@MessageBuffer'

export default class ApiClient {
  constructor (url) {
    this.url = url
    this.state = this.clearState()
    this.buffer = new Buffer()
    this.processBuffer = this.processBuffer.bind(this)
    this.handleAck = this.handleAck.bind(this)
    this.stats = {
      sent: 0,
      ack: 0
    }
  }

  handleAck (data) {
    if (data.clientRequestId) {
      const messages = this.buffer.get()
      const remainingMessages = messages.filter(x => (
        x.clientRequestId !== data.clientRequestId
      ))
      this.buffer.set(remainingMessages)
      const filteredOne = remainingMessages.length === messages.length - 1
      if (filteredOne) {
        this.stats.ack++
      }
      console.log(`API: Stats, ${this.stats.sent} sent, ${this.stats.ack} acknowledged.`)
    }
  }

  processBuffer () {
    const { connected } = this.state
    if (connected) {
      const messages = this.buffer.get()
      if (messages.length) {
        console.log('API: Processing message buffer, messages=', messages)
        this.sendClientRequest(messages[0])
      }
    }
  }

  sendClientRequest (message) {
    const { socket } = this.state
    if (socket) {
      socket.emit('clientRequest', message, this.handleAck)
    }
  }

  createId () {
    return (Math.floor(Math.random() * 1000) + 1000) + '_' + Date.now()
  }

  send (topic, payload, buffer = true) {
    const message = {
      clientRequestId: this.createId(),
      topic,
      payload
    }
    if (buffer) {
      // Buffer message for sending (a few moments later).
      const messages = this.buffer.get()
      messages.push(message)
      this.buffer.set(messages)
    } else {
      // Send unbuffered message.
      this.sendClientRequest(message)
    }
    this.stats.sent++
  }

  clearState () {
    return {
      authenticated: false,
      connected: false,
      socket: null
    }
  }

  setListener (listener) {
    this.listener = listener
  }

  connect () {
    console.log(`API: Connecting to ${this.url}`)
    const socket = window.io.connect(this.url)

    socket.on('connect', () => {
      console.log('API: Socket connected.')
      this.state.connected = true

      // Start processing our message buffer.
      if (!this.timer) {
        this.timer = setInterval(this.processBuffer, 500)
      }
    })
    socket.on('welcome', data => {
      console.log('API: Got welcome message, data=', data)
    })
    socket.on('clientRequestError', data => {
      console.log('API: Error, data=', data)
    })
    socket.on('serverMessage', data => {
      console.log('API: Server message=', data)
      if (this.listener) {
        this.listener(data)
      }
    })
    this.state.socket = socket
  }
}

class Buffer {
  get () {
    let arr = window.localStorage.getItem(STORAGE_KEY)
    if (!arr) {
      return []
    }
    try {
      arr = JSON.parse(arr)
    } catch (exp) {
      arr = []
    }
    return arr
  }

  set (arr) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  }
}
