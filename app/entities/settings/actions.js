'use strict'

const USE_FAKE_API = true

import Api from '../api'
import * as types from './types'
import { push, goBack as routeBack } from 'react-router-redux'

export const setSetting = (key, value) => ({
  type: types.SET_SETTING,
  payload: { [key]: value }
})

export const setSettings = (payload) => ({
  type: types.SET_SETTING,
  payload
})

export const login = (email, password) => Api.actions.login(email, password)

export const logout = () =>
  (dispatch, getState) => {
    const identity = getState().settings.identity
    const accessToken = identity && identity.accessToken

    dispatch(Api.actions.logout(accessToken))
    dispatch({ type: types.CLEAR_IDENTITY })
    dispatch(routeTo('/login'))
  }

export const loginSuccessful = (payload) =>
  (dispatch, getState) => {
    dispatch(setIdentity(payload))
    dispatch(loadApp())
    dispatch(routeTo('/'))
  }

export const loadApp = () =>
  (dispatch, getState) => {
    dispatch(setSetting('isAppLoading', true))
    dispatch(Api.actions.starter())
  }

export const routeTo = (uri) => push(uri)
export const goBack = () => routeBack()

export const setIdentity = (payload) =>
  (dispatch, getState) => {
    dispatch({
      type: types.SET_IDENTITY,
      payload: payload.identity
    })
  }

export const apiRequest = (topic, payload) =>
  (dispatch, getState) => {
    dispatch(setIsRequestInProgress(true))
    const promise = USE_FAKE_API
      ? fakeApiCall(topic, payload, dispatch)
      : realApiCall()
    return promise.then(() => {
      dispatch(setIsRequestInProgress(false))
    })
  }

function realApiCall (topic, payload, dispatch) {
  return new Promise(resolve => {
    console.log('TODO: Implement real API calls!')
    resolve()
  })
}

function fakeApiCall (topic, payload, dispatch) {
  console.log('Fake API call, topic=', topic, 'payload=', payload)
  return new Promise(resolve => {
    setTimeout(() => {
      // Fake responses.
      switch (topic) {
        case 'auth':
          dispatch(loginSuccessful({
            identity: {
              email: 'ace@base.se',
              accessToken: '123456'
            }
          }))
          break
      }
      resolve()
    }, 500)
  })
}

export const setIsRequestInProgress = (value) => setSetting('isRequestInProgress', value)
export const setConnectedToServer = (value) => setSetting('isConnectedToServer', value)
export const setServerError = (error) => setSetting('serverError', error)
export const clearError = () => setSetting('serverError', null)
export const setTerminalText = (text) => setSetting('terminalText', text)
