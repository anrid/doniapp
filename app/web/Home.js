'use strict'

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import './Home.css'

class Home extends Component {
  render () {
    const { children } = this.props
    return (
      <div className='Home'>
        <div className='Home__Header'>Home</div>
        <div className='Home__Menu'>
          <div><Link to='/about'>About</Link></div>
          <div><Link to='/inbox'>Inbox</Link></div>
          <div><Link to='/text'>Retro Text Interface</Link></div>
        </div>
        <div className='Home__Content'>
          {children}
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  children: PropTypes.any
}

export default Home
