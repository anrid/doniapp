'use strict'

import Settings from '../settings'
import * as types from './types'
import { fetchJson } from '../../lib/util'

export const authToken = (token) => (
  { type: types.AUTH_TOKEN, topic: 'auth:token', payload: { token }, buffer: false }
)

export const login = (email, password) => (
  { type: types.LOGIN, topic: 'auth', payload: { email, password }, buffer: false }
)

export const logout = (accessToken) => (
  { type: types.LOGOUT, topic: 'signout', payload: { accessToken }, buffer: false }
)

export const starter = () => (
  { type: types.STARTER, topic: 'app:starter', payload: {}, buffer: false }
)

export const checkGoogleIdToken = (idToken) => (
  fetchJson('/google-check-id-token', { idToken })
)

export const updateServerCounter = () => ({
  type: types.UPDATE_SERVER_COUNTER,
  topic: 'server:update:counter',
  payload: { value: Math.floor(Math.random() * 100) + 1 }
})

export const serverMessage = (data) =>
  (dispatch) => {
    console.log('Server message action, data=', data)
    switch (data.topic) {
      case 'auth:token:successful':
        return dispatch(Settings.actions.authTokenSuccessful(data.payload))
      case 'auth:successful':
        return dispatch(Settings.actions.loginSuccessful(data.payload))
      case 'app:starter':
        return dispatch(Settings.actions.setSettings(data.payload))
      case 'server:update:counter':
        return dispatch(Settings.actions.writeTextToTerminal(
          `Server counter is ${data.payload.value}.\n`
        ))
      case 'echo':
        return console.log('Got echo from server:', data.payload.echo)
      default:
        console.error('Unhandled server message:', data)
    }
  }
