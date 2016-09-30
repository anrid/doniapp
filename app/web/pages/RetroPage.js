'use strict'

import React, { Component } from 'react'
import { RouteTransition, presets } from 'react-router-transition'

import C64Terminal from '../C64Terminal'

class RetroPage extends Component {
  render () {
    return (
      <RouteTransition pathname='c64' {...presets.pop}>
        <C64Terminal {...this.props} />
      </RouteTransition>
    )
  }
}

export default RetroPage
