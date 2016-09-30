'use strict'

import { connect } from 'react-redux'

import { InboxStats } from './Inbox'

function mapStateToProps (state, ownProps) {
  return {
    messages: [
      { id: 1, title: 'Message 1', read: true, created: new Date() },
      { id: 2, title: 'Message 2', read: true, created: new Date() },
      { id: 3, title: 'Message 3', read: true, created: new Date() }
    ]
  }
}

const ConnectedInboxStats = connect(
  mapStateToProps,
  null
)(InboxStats)

export default ConnectedInboxStats
