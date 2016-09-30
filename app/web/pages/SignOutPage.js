'use strict'

import React, { Component, PropTypes } from 'react'
import { RouteTransition, presets } from 'react-router-transition'

import './SignOutPage.css'

class SignOutPage extends Component {
  componentDidMount () {
    const { signOutAction } = this.props
    setTimeout(signOutAction, 1500)
  }
  render () {
    return (
      <RouteTransition pathname='logout' {...presets.fade}>
        <div className='SignOutPage'>
          <div className='SignOutPage__Header'>We will never forget you.</div>
        </div>
      </RouteTransition>
    )
  }
}

SignOutPage.propTypes = {
  signOutAction: PropTypes.func.isRequired
}

export default SignOutPage
