'use strict'

const STORAGE_KEY = '@MessageBuffer'

export default class ApiClient {
  constructor (url) {
    this.url = url
    this.state = this.clearState()
    this.buffer = new Buffer()
    this.processBuffer = this.processBuffer.bind(this)
  }

  processBuffer () {
    const { connected, socket } = this.state
    if (connected && socket) {
      const messages = this.buffer.get()
      if (messages.length) {
        console.log('Processing message buffer:', messages)
        socket.emit('clientRequest', messages[0], data => {
          if (data.clientRequestId) {
            this.buffer.set(
              messages.filter(x => x.clientRequestId !== data.clientRequestId)
            )
          }
        })
      }
    }
  }

  createId () {
    return (Math.floor(Math.random() * 1000) + 1000) + '_' + Date.now()
  }

  send (topic, payload) {
    const messages = this.buffer.get()
    messages.push({
      clientRequestId: this.createId(),
      topic,
      payload
    })
    this.buffer.set(messages)
  }

  clearState () {
    return {
      authenticated: false,
      connected: false,
      socket: null
    }
  }

  connect () {
    const socket = window.io.connect('ws://localhost:4002')
    socket.on('connect', () => {
      console.log('Socket connected.')
      this.state.connected = true

      // Start processing our message buffer.
      if (!this.timer) {
        this.timer = setInterval(this.processBuffer, 500)
      }
    })
    socket.on('welcome', data => {
      console.log('Socket got welcome message:', data)
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
