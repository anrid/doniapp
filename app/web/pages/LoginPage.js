/* global gapi */
'use strict'

import React, { Component, PropTypes } from 'react'
import { RouteTransition, presets } from 'react-router-transition'
import { Motion, spring } from 'react-motion'

import './LoginPage.css'

class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'ace@base.se',
      password: '123456',
      authResponse: null,
      gapiState: 'loading',
      isSignedIn: false,
      loginDirectly: false
    }
    this.clickGoogleSignIn = this.clickGoogleSignIn.bind(this)
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this)
  }

  onChange (field, value) {
    this.setState({ [field]: value })
  }

  clickGoogleSignIn () {
    gapi.auth2.getAuthInstance().signIn()
  }

  onGoogleSignIn () {
    const { actions } = this.props
    const auth = gapi.auth2.getAuthInstance()
    const isSignedIn = auth.isSignedIn.get()
    const state = { isSignedIn }
    if (isSignedIn) {
      const user = auth.currentUser.get()
      state.authResponse = user.getAuthResponse()
      if (this.state.loginDirectly) {
        // Login immediately following a successful Google auth.
        actions.googleLogin(state.authResponse.id_token)
      }
    } else {
      state.loginDirectly = true
    }
    console.log('onGoogleSignIn:', state)
    this.setState(state)
  }

  componentDidMount () {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: window.Config.GOOGLE_CLIENT_ID,
        scope: 'profile email'
      })
      .then(() => {
        // Listen for Google sign in events.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.onGoogleSignIn)
        this.onGoogleSignIn()
        this.setState({ gapiState: 'ready' })
      })
    })
    // gapi.signin2.render('googleSigninButton', {
    //   scope: 'profile email',
    //   width: 240,
    //   height: 50,
    //   longtitle: true,
    //   theme: 'dark',
    //   onsuccess: (googleUser) => {
    //     if (googleUser) {
    //       console.log('Google: Is signed in as', googleUser.getBasicProfile().getEmail())
    //       this.setState({ authResponse: googleUser.getAuthResponse() })
    //     }
    //   },
    //   onfailure: (error) => console.log('Google signin error:', error)
    // })
  }

  renderForm () {
    const { actions } = this.props
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
          <button onClick={() => actions.login(email, password)}>Login</button>
        </div>
      </div>
    )
  }

  renderGoogleButton () {
    const { actions } = this.props
    const { gapiState, authResponse } = this.state

    let button = <div className='GoogleButton GoogleButton--Disabled' />
    if (gapiState !== 'loading') {
      if (!authResponse) {
        button = <div className='GoogleButton GoogleButton--Active' onClick={() => this.clickGoogleSignIn()} />
      } else {
        button = <button onClick={() => actions.googleLogin(authResponse.id_token)}>Go to App</button>
      }
    }

    return (
      <div className={'LoginPage__Buttons ' + (authResponse ? 'LoginPage__Buttons--HideGoogleButton' : '') }>
        {button}
      </div>
    )
  }

  render () {
    return (
      <RouteTransition pathname='login' {...presets.slideRight}>
        <div className='LoginPage SkyGradient11'>
          <div className='LoginPage__Cloud LoginPage__CloudOne' />
          <div className='LoginPage__Cloud LoginPage__CloudTwo' />
          <Motion
            defaultStyle={{scale: 0.90, opacity: 0.6}}
            style={{
              spacing: spring(5, {stiffness: 1, damping: 0.5}),
              opacity: spring(1, {stiffness: 0.25, damping: 0.25})
            }}
          >
            {value => (
              <div className='LoginPage__Header'>
                <div className='LoginPage__Logo' style={{ opacity: value.opacity }}>
                  ether
                </div>
                <div className='LoginPage__Subheading' style={{ opacity: value.opacity }}>
                  Stay a while, and listen.
                </div>
              </div>
            )}
          </Motion>
          {this.renderGoogleButton()}
        </div>
      </RouteTransition>
    )
  }
}

LoginPage.propTypes = {
  actions: PropTypes.object.isRequired
}

export default LoginPage
