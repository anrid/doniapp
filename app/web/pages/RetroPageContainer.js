'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Settings from '../../entities/settings'
import RetroPage from './RetroPage'

function mapStateToProps (state) {
  return {
    text: Settings.selectors.getTerminalText(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      goBack: Settings.actions.goBack
    }, dispatch)
  }
}

const ConnectedRetroPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RetroPage)

export default ConnectedRetroPage
