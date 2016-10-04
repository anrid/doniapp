'use strict'

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { RouteTransition, presets } from 'react-router-transition'

import './DemosPage.css'

class DemosPage extends Component {
  render () {
    const { children } = this.props
    return (
      <RouteTransition pathname='home' {...presets.fade}>
        <div className='DemosPage'>
          <div className='DemosPage__Header'>Home</div>
          <ul>
            <li><Link to='/demos/input-widget'>InputWidget</Link></li>
          </ul>
          <div className='DemosPage__Content'>
            {children}
          </div>
        </div>
      </RouteTransition>
    )
  }
}

DemosPage.propTypes = {
  children: PropTypes.any
}

export default DemosPage
