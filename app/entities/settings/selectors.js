'use strict'

export const getIdentity = (state) => state.settings.identity
export const isAuthenticated = (state) => state.settings.identity && state.settings.identity.accessToken
export const getTerminalText = (state) => state.settings.terminalText
