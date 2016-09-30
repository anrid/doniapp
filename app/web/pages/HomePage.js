'use strict'

import React, { Component, PropTypes } from 'react'
import { RouteTransition, presets } from 'react-router-transition'

import './HomePage.css'

import Menu, { MenuItem } from '../misc/Menu'

class HomePage extends Component {
  render () {
    const { children } = this.props
    return (
      <RouteTransition pathname='home' {...presets.pop}>
        <div className='HomePage'>
          <div className='HomePage__Header'>Home</div>
          <Menu>
            <MenuItem path='/about' text='About' />
            <MenuItem path='/inbox' text='Inbox' />
            <MenuItem path='/signout' text='Sign Out' />
            <MenuItem path='/retro' text='Go Retro !' />
          </Menu>
          <div className='HomePage__Content'>
            {children}
          </div>
        </div>
      </RouteTransition>
    )
  }
}

HomePage.propTypes = {
  children: PropTypes.any
}

export default HomePage
