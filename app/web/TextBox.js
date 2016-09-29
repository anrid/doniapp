'use strict'

import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import './TextBox.css'

export default class TextBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      isTyping: false
    }
    this.printText = this.printText.bind(this)
    this.handleKeys = this.handleKeys.bind(this)
    this.focus = this.focus.bind(this)
  }
  componentDidMount () {
    this.focus()
    setTimeout(this.printText, 500)
  }

  focus () {
    findDOMNode(this.refs.input).focus()
  }

  printText () {
    const typeSpeed = 1000 / 60
    const from = this.props.text
    const to = this.state.text
    if (from !== to) {
      this.setState({
        text: from.substr(0, to.length + 1),
        isTyping: true
      })
      setTimeout(this.printText, Math.floor(Math.random() * typeSpeed) + typeSpeed)
    } else if (this.state.isTyping) {
      this.setState({ isTyping: false })
    }
  }

  handleKeys (e) {
    // console.log('e.key=', e.key)
    let char = e.key
    let text = this.state.text
    if (e.key.length > 1) {
      if (e.key === 'Tab') {
        this.setState({ text: text + '  ' })
      }
      if (e.key === 'Enter') {
        this.setState({ text: text + `\n` })
      }
      if (e.key === 'Backspace') {
        text = text.length ? text.substr(0, text.length - 1) : ''
        this.setState({ text })
      }
      e.stopPropagation()
      e.preventDefault()
    } else {
      this.setState({ text: text + char })
    }

    this.setState({ isTyping: true })
    if (this.isTypingTimer) {
      clearInterval(this.isTypingTimer)
    }
    this.isTypingTimer = setTimeout(() => {
      this.setState({ isTyping: false })
    }, 500)
  }

  render () {
    const { text, isTyping } = this.state
    return (
      <div className='TextBox' onClick={this.focus}>
        <div className={'Text ' + (isTyping ? 'Text--isTyping' : '')}>
          {text}
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

TextBox.propTypes = {
  text: React.PropTypes.string.isRequired
}
