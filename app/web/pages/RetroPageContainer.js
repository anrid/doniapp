'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Api from '../../entities/api'
import Settings from '../../entities/settings'
import RetroPage from './RetroPage'

function mapStateToProps (state) {
  return {
    ...Settings.selectors.getTerminalState(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: {
      settings: bindActionCreators({ ...Settings.actions }, dispatch),
      api: bindActionCreators({ ...Api.actions }, dispatch)
    }
  }
}

const ConnectedRetroPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RetroPage)

export default ConnectedRetroPage
