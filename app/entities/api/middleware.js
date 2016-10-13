'use strict'

export function createApiClientMiddleware (client) {
  return store => next => action => {
    if (action.topic) {
      console.log('API client middleware found action:', action)
      client.send(action.topic, action.payload, action.buffer || true)
    }
    return next(action)
  }
}
