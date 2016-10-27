'use strict'

import Api from '../api'
import * as types from './types'
import { push, goBack as routeBack } from 'react-router-redux'
import Storage from '../../lib/storage'

export const setSetting = (key, value) => ({
  type: types.SET_SETTING,
  payload: { [key]: value }
})

export const setSettings = (payload) => ({
  type: types.SET_SETTING,
  payload
})

export const googleLogin = (idToken) =>
  (dispatch) => {
    Api.actions.checkGoogleIdToken(idToken)
    .then(identity => dispatch(loginSuccessful({ identity })))
    .catch(error => console.error('Google login failed:', error, error.json))
  }

export const logout = () =>
  (dispatch, getState) => {
    const identity = getState().settings.identity
    const accessToken = identity && identity.accessToken

    Storage.set({ savedIdentity: null })
    dispatch(Api.actions.logout(accessToken))
    dispatch({ type: types.CLEAR_IDENTITY })
    dispatch(routeTo('/login'))
  }

export const loginSuccessful = (payload) =>
  (dispatch, getState) => {
    Storage.set({ savedIdentity: payload })
    dispatch(setIdentity(payload))
    dispatch(Api.actions.starter())
    dispatch(routeTo('/'))
  }

export const authTokenSuccessful = (payload) =>
  (dispatch, getState) => {
    Storage.set({ savedIdentity: payload })
    dispatch(setIdentity(payload))
    dispatch(Api.actions.starter())
    console.log('Route or don’t route... that is the question !')
    // dispatch(routeTo('/'))
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

export const setIsAppLoading = (value) => setSetting('isAppLoading', value)
export const setIsRequestInProgress = (value) => setSetting('isRequestInProgress', value)
export const setConnectedToServer = (value) => setSetting('isConnectedToServer', value)
export const setServerError = (error) => setSetting('serverError', error)
export const clearError = () => setSetting('serverError', null)

export const setTerminalText = (text) => setSetting('terminalText', text)
export const setTerminalBuffer = (text) => setSetting('terminalBuffer', text)
export const setTerminalIsTyping = (value) => setSetting('terminalIsTyping', value)

export const writeTextToTerminal = (text, reset = false) =>
  (dispatch, getState) => {
    const current = getState().settings.terminalText
    const payload = { }
    if (reset) {
      payload.terminalBuffer = ''
      payload.terminalText = text
    } else {
      payload.terminalText = current + text
    }
    dispatch({
      type: types.SET_SETTING,
      payload
    })
    dispatch(terminalPrintLoop())
  }

export const updateTerminal = (text) => ({
  type: types.SET_SETTING,
  payload: {
    terminalText: text,
    terminalBuffer: text,
    terminalIsTyping: true
  }
})

const terminalPrintSpeed = 1000 / 60
export const terminalPrintLoop = () =>
  (dispatch, getState) => {
    const { terminalText, terminalBuffer, terminalIsTyping } = getState().settings
    if (terminalText !== terminalBuffer) {
      const nextBuffer = terminalText.substr(0, terminalBuffer.length + 1)
      dispatch({
        type: types.SET_SETTING,
        payload: {
          terminalBuffer: nextBuffer,
          terminalIsTyping: true
        }
      })

      const delay = Math.floor(Math.random() * terminalPrintSpeed) + terminalPrintSpeed
      setTimeout(() => dispatch(terminalPrintLoop()), delay)
    } else if (terminalIsTyping) {
      dispatch(setTerminalIsTyping(false))
    }
  }
