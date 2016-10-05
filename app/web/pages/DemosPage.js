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
          <div className='DemosPage__Left'>
            <div className='DemosPage__Header'>Demos</div>
            <ul className='DemosPage__Menu'>
              <li><Link to='/demos/input-widget'>InputWidget</Link></li>
            </ul>
          </div>
          <div className='DemosPage__Main'>
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
