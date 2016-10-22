/* global gapi */
'use strict'

import React, { Component, PropTypes } from 'react'
import { RouteTransition, presets } from 'react-router-transition'
import { fetchJson } from '../../lib/util'

import './LoginPage.css'

class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'ace@base.se',
      password: '123456'
    }
  }

  onChange (field, value) {
    this.setState({ [field]: value })
  }

  onGoogleSigninSuccess (googleUser) {
    const authResponse = googleUser.getAuthResponse()
    fetchJson('/google-check-id-token', { idToken: authResponse.id_token })
    .then(res => console.log('Got response:', res))
  }

  onGoogleSigninFailure (error) {
    console.log(error)
  }

  componentDidMount () {
    gapi.signin2.render('googleSigninButton', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onGoogleSigninSuccess,
      'onfailure': this.onGoogleSigninFailure
    })
  }

  renderForm () {
    const { loginAction } = this.props
    const { email, password } = this.state
    return (
      <div className='LoginPage__Form'>
        <div>
          <div className='LoginPage__FormField'>
            <input type='email' value={email}
              onChange={(e) => this.onChange('email', e.target.value)}
              placeholder='who@am.i' spellCheck='false'
            />
          </div>
          <div className='LoginPage__FormField'>
            <input type='password' value={password}
              onChange={(e) => this.onChange('password', e.target.value)}
              placeholder='Password'
            />
          </div>
        </div>
        <div className='LoginPage__Buttons'>
          <button onClick={() => loginAction(email, password)}>Login</button>
        </div>
      </div>
    )
  }

  render () {
    return (
      <RouteTransition pathname='login' {...presets.slideRight}>
        <div className='LoginPage SkyGradient11'>
          <div className='LoginPage__Cloud LoginPage__CloudOne' />
          <div className='LoginPage__Cloud LoginPage__CloudTwo' />
          <div className='LoginPage__Header'>Stay a while, and listen.</div>
          <div id='googleSigninButton'></div>
        </div>
      </RouteTransition>
    )
  }
}

LoginPage.propTypes = {
  loginAction: PropTypes.func.isRequired
}

export default LoginPage
