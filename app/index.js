'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import './global.css'

import TextBox from './TextBox'

ReactDOM.render(
  <TextBox text={`Hello, world!\nStart typing:\n`} />,
  document.getElementById('app')
)
