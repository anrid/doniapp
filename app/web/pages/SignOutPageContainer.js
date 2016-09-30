'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Settings from '../../entities/settings'
import SignOutPage from './SignOutPage'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signOutAction: Settings.actions.logout
  }, dispatch)
}

const ConnectedSignOutPage = connect(
  null,
  mapDispatchToProps
)(SignOutPage)

export default ConnectedSignOutPage
