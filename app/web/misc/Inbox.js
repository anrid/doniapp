'use strict'

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { RouteTransition, presets } from 'react-router-transition'

import './Inbox.css'

export default class Inbox extends Component {
  render () {
    const { children } = this.props
    return (
      <RouteTransition pathname='home' {...presets.slideRight}>
        <div className='Inbox'>
          <div className='Inbox__Header'>Inbox</div>
          <div className='Inbox__Content'>
            {children}
          </div>
        </div>
      </RouteTransition>
    )
  }
}

export const InboxStats = ({ messages }) => (
  <div className='Inbox__Stats'>
    <div className='Inbox__StatsText'>Neat Inbox Stats:</div>
    <div className='Inbox__StatsText'>Messages: {messages.length}</div>
    <div className='Inbox__StatsText'>Unread: {messages.filter(x => x.read === false).length}</div>
    <div className='Inbox__MessageLinks'>
      {messages.map(x => (
        <Link key={x.id} to={`/inbox/message/${x.id}`}>Show Message #{x.id}</Link>
      ))}
    </div>
  </div>
)

export const InboxMessage = ({ message }) => (
  <RouteTransition pathname='home' {...presets.slideRight}>
    <div className='Inbox__Message'>
      <div>Message #{message.id}</div>
      <div>Title: {message.title}</div>
    </div>
  </RouteTransition>
)

Inbox.propTypes = {
  children: PropTypes.any
}
