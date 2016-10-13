'use strict'

export const getIdentity = (state) => state.settings.identity
export const isAuthenticated = (state) => state.settings.identity && state.settings.identity.accessToken
export const getTerminalState = (state) => ({
  text: state.settings.terminalText,
  buffer: state.settings.terminalBuffer,
  isTyping: state.settings.terminalIsTyping
})
