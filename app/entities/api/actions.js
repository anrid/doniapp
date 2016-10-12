'use strict'

import Settings from '../settings'
import * as types from './types'

export const login = (email, password) => dispatch => (
  dispatch({ type: types.LOGIN, topic: 'auth', payload: { email, password } })
)

export const logout = (accessToken) => (
  { type: types.LOGOUT, topic: 'signout', payload: { accessToken } }
)

export const starter = () => (
  { type: types.STARTER, topic: 'app:starter', payload: {} }
)

export const serverMessage = (data) =>
  (dispatch) => {
    console.log('Server message action, data=', data)
    switch (data.topic) {
      case 'auth:successful':
        return dispatch(Settings.actions.loginSuccessful(data.payload))
      case 'app:starter':
        return dispatch(Settings.actions.setSettings(data.payload))
      case 'echo':
        return console.log('Got echo from server:', data.payload.echo)
      default:
        console.error('Unhandled server message:', data)
    }
  }
