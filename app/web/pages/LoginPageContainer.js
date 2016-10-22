'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Settings from '../../entities/settings'
import LoginPage from './LoginPage'

function mapStateToProps (state, ownProps) {
  return {
    isAuthenticated: Settings.selectors.isAuthenticated(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      login: Settings.actions.login,
      googleLogin: Settings.actions.googleLogin
    }, dispatch)
  }
}

const ConnectedLoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)

export default ConnectedLoginPage
