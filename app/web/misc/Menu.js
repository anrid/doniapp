'use strict'

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import './Menu.css'

export default class Menu extends Component {
  render () {
    const { children } = this.props
    return (
      <div className='Menu'>
        {children}
      </div>
    )
  }
}

Menu.propTypes = {
  children: PropTypes.any
}

export const MenuItem = ({ path, text }) => (
  <Link
    className='MenuItem'
    activeClassName='MenuItem--Active'
    to={path}>
    {text}
  </Link>
)
