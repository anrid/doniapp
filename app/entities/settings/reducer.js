'use strict'

import U from 'updeep'
import * as types from './types'

const initialState = U({
  isConnectedToServer: false,
  isRequestPending: false,
  serverError: null,
  identity: {
    email: 'ace@base.se',
    accessToken: '123456'
  },
  route: null,
  isAppLoading: false
}, { })

function replaceSettings (state, payload) {
  const update = Object.keys(payload).reduce((acc, x) => {
    acc[x] = U.constant(payload[x])
    return acc
  }, { })
  return U(update, state)
}

export default function settings (state = initialState, action = { }) {
  switch (action.type) {
    case types.SET_SETTING:
      return replaceSettings(state, action.payload)
    case types.SET_IDENTITY:
      return U({ identity: action.payload }, state)
    case types.CLEAR_IDENTITY:
      return U({ identity: null }, state)
    case types.REQUEST_FULFILLED:
      return U({ isRequestPending: false }, state)
    case types.REQUEST_ERROR:
      return U({ isRequestPending: false }, state)
    case types.REQUEST_ABORTED:
      return U({ isRequestPending: false }, state)
    case types.REQUEST_PENDING:
      return U({ isRequestPending: true }, state)
    default:
      return state
  }
}
