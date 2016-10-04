'use strict'

import React, { Component } from 'react'

import InputWidget from './InputWidget'

let count = 0
const photos = [
  'https://s-media-cache-ak0.pinimg.com/564x/c5/77/b5/c577b514084f0d8630edec5421a52400.jpg',
  'https://c1.staticflickr.com/3/2918/13981555925_ed3fa89c6f.jpg',
  'https://c2.staticflickr.com/6/5767/21055813582_20051c7847.jpg',
  'https://s-media-cache-ak0.pinimg.com/564x/18/90/ab/1890ab13710e49be67dd42dc9673bfe8.jpg',
  'https://c1.staticflickr.com/3/2565/3863323065_fcb4b20312_z.jpg'
]

import quotes from './quotes.js'

function getShortSentence (str) {
  const parts = str.trim().substr(0, 64).split(/\s+/)
  parts.pop()
  return parts.join(' ')
}

function generateItem () {
  ++count
  const photo = photos[count % photos.length]
  const quote = quotes[count % quotes.length]
  return {
    id: count,
    text: getShortSentence(quote.title),
    sub: getShortSentence(quote.content),
    type: 'sumthin’sumthin’',
    photo
  }
}

export default class InputWidgetDemo extends Component {
  render () {
    console.log('quotes:', quotes)
    const items = [
      generateItem(),
      generateItem(),
      generateItem()
    ]
    const onSearch = (...rest) => console.log('onSearch:', rest)
    const onSelect = (...rest) => console.log('onSelect:', rest)
    return (
      <InputWidget items={items} onSearch={onSearch} onSelect={onSelect} />
    )
  }
}

InputWidget.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSearch: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  animate: React.PropTypes.bool,
  selected: React.PropTypes.array
}
