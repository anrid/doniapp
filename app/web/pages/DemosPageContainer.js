'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Settings from '../../entities/settings'
import DemosPage from './DemosPage'

function mapStateToProps (state, ownProps) {
  return {
    isAuthenticated: Settings.selectors.isAuthenticated(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...Settings.actions
    }, dispatch)
  }
}

const ConnectedDemosPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DemosPage)

export default ConnectedDemosPage
