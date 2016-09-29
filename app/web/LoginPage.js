'use strict'

import React, { Component, PropTypes } from 'react'

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

  render () {
    const { loginAction } = this.props
    const { email, password } = this.state

    return (
      <div className='LoginPage'>
        <div className='LoginPage__Header'>Stay a while, and listen.</div>
        <div className='LoginPage__Form'>
          <div className='LoginPage__FormField'>
            <label>Email</label>
            <input type='email' value={email} onChange={(e) => this.onChange('email', e.target.value)} />
          </div>
          <div className='LoginPage__FormField'>
            <label>Password</label>
            <input type='password' value={password} onChange={(e) => this.onChange('password', e.target.value)} />
          </div>
        </div>
        <div className='LoginPage__Buttons'>
          <button onClick={() => loginAction(email, password)}>Login</button>
        </div>
      </div>
    )
  }
}

LoginPage.propTypes = {
  loginAction: PropTypes.func.isRequired
}

export default LoginPage
