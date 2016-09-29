'use strict'

import React, { Component, PropTypes } from 'react'

import './Inbox.css'

class Inbox extends Component {
  render () {
    const { children } = this.props
    return (
      <div className='Inbox'>
        <div className='Inbox__Header'>Inbox</div>
        <div className='Inbox__Content'>
          {children}
        </div>
      </div>
    )
  }
}

Inbox.propTypes = {
  children: PropTypes.any
}

export default Inbox
