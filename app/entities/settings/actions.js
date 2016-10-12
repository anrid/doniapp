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

export const login = (email, password) => Api.actions.login(email, password)

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
    dispatch(loadApp())
    dispatch(routeTo('/'))
  }

export const loadSavedIdentity = (identity) => ({
  type: types.SET_IDENTITY,
  payload: identity
})

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

export const setIsRequestInProgress = (value) => setSetting('isRequestInProgress', value)
export const setConnectedToServer = (value) => setSetting('isConnectedToServer', value)
export const setServerError = (error) => setSetting('serverError', error)
export const clearError = () => setSetting('serverError', null)
export const setTerminalText = (text) => setSetting('terminalText', text)
