'use strict'

import React, { Component, PropTypes } from 'react'

import './App.css'

class App extends Component {
  render () {
    const { children } = this.props
    return (
      <div className='App'>
        {children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.any
}

export default App
