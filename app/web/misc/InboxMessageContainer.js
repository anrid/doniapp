'use strict'

import { connect } from 'react-redux'

import { InboxMessage } from './Inbox'

const messagesTestData = {
  '1': { id: 1, title: 'Message 1', read: true, created: new Date() },
  '2': { id: 2, title: 'Message 2', read: true, created: new Date() },
  '3': { id: 3, title: 'Message 3', read: true, created: new Date() }
}

function mapStateToProps (state, ownProps) {
  const messageId = ownProps.params.id
  return {
    message: messagesTestData[messageId]
  }
}

const ConnectedInboxMessage = connect(
  mapStateToProps,
  null
)(InboxMessage)

export default ConnectedInboxMessage
