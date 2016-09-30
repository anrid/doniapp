'use strict'

import React, { Component } from 'react'
import { RouteTransition, presets } from 'react-router-transition'

import './AboutPage.css'

class AboutPage extends Component {
  render () {
    return (
      <RouteTransition pathname='home' {...presets.pop}>
        <div className='AboutPage'>
          <div className='AboutPage__Header'>About</div>
        </div>
      </RouteTransition>
    )
  }
}

export default AboutPage
