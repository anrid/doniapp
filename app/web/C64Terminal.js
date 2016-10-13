'use strict'

import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

import './C64Terminal.css'

export default class C64Terminal extends Component {
  constructor (props) {
    super(props)
    this.handleKeys = this.handleKeys.bind(this)
    this.focus = this.focus.bind(this)
  }

  componentDidMount () {
    this.focus()
    this.props.actions.settings.terminalPrintLoop()
  }

  focus () {
    findDOMNode(this.refs.input).focus()
  }

  parseCommand (text) {
    const { actions } = this.props
    const lines = text.split(`\n`)
    const command = lines[lines.length - 1].trim().toLowerCase()
    switch (command) {
      case 'back':
        actions.settings.goBack()
        break
      case 'bump':
        actions.api.updateServerCounter()
        break
      case 'clear':
        actions.settings.writeTextToTerminal(`Clear your mind. Start typing:\n`, true)
        break
      case 'help':
        actions.settings.writeTextToTerminal(
          `Available commands are:\n` +
          `bump    - Update server counter and get latest value.\n` +
          `clear   - Clear the terminal.\n` +
          `help    - This command, obviously.\n` +
          `back    - Go on and git !\n\n`
        )
        break

      default:
        console.log(`Unknown command '${command}'`)
    }
  }

  handleKeys (e) {
    // console.log('e.key=', e.key)
    const { updateTerminal, setTerminalIsTyping } = this.props.actions.settings
    const { buffer } = this.props

    let char = e.key
    if (e.key.length > 1) {
      if (e.key === 'Tab') {
        updateTerminal(buffer + '  ')
      }
      if (e.key === 'Enter') {
        updateTerminal(buffer + `\n`)
        this.parseCommand(buffer)
      }
      if (e.key === 'Backspace') {
        updateTerminal(buffer.length ? buffer.substr(0, buffer.length - 1) : '')
      }
      e.stopPropagation()
      e.preventDefault()
    } else {
      updateTerminal(buffer + char)
    }

    // Turn off terminalIsTyping flag within 500 ms.
    if (this.isTypingTimer) {
      clearInterval(this.isTypingTimer)
    }
    this.isTypingTimer = setTimeout(() => {
      setTerminalIsTyping(false)
    }, 500)
  }

  render () {
    const { buffer, isTyping } = this.props
    return (
      <div className='C64Terminal' onClick={this.focus}>
        <div className={'C64Terminal__Text ' + (isTyping ? 'C64Terminal__Text--isTyping' : '')}>
          {buffer}
        </div>
        <textarea
          type='text'
          onKeyDown={this.handleKeys}
          style={{ width: 0, height: 0, opacity: 0 }}
          autoFocus
          ref='input'
          />
      </div>
    )
  }
}

C64Terminal.propTypes = {
  text: PropTypes.string.isRequired,
  buffer: PropTypes.string.isRequired,
  isTyping: PropTypes.bool,
  actions: React.PropTypes.object.isRequired
}
