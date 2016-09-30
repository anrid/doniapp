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
  return bindActionCreators({
    loginAction: Settings.actions.login
  }, dispatch)
}

const ConnectedLoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)

export default ConnectedLoginPage
