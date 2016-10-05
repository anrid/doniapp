'use strict'

import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'
import debounce from 'lodash.debounce'

import './InputWidget.css'

const springModel = {
  stiffness: 300,
  damping: 15
}

export default class InputWidget extends Component {
  constructor (props) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
    this._doSearch = debounce(this.props.onSearch, 350)
    this.state = {
      page: 1,
      max: 5
    }
    this.onNextPage = this.onNextPage.bind(this)
  }

  onNextPage (direction) {
    const { items } = this.props
    const { page, max } = this.state

    const pages = Math.ceil(items.length / max)
    let next = page + direction

    if (next < 1) {
      next = 1
    } else if (next > pages) {
      next = pages
    }

    this.setState({ page: next })
  }

  onSearch (e) {
    const query = e.target.value
    this.setState({ page: 1 })
    this._doSearch(query)
  }

  renderSearchBox () {
    return (
      <div className='InputWidget__SearchBox'>
        <i className='fa fa-fw fa-search' />
        <input type='text'
          placeholder='Search'
          onChange={this.onSearch}
        />
      </div>
    )
  }

  renderContent (scale, fade) {
    let style = { }
    // Apply style when both scale and fade are neither null nor undefined.
    if (scale != null && fade != null) {
      style = {
        transform: `scale(${scale},${scale})`,
        opacity: fade
      }
    }

    const { items, selected, onSelect } = this.props
    const { page, max } = this.state
    const pages = Math.ceil(items.length / max)

    const rows = items
    .filter((x, i) => { // Only items on the current page
      const onPage = Math.ceil((i + 1) / max)
      // console.log('onPage=', onPage, 'x.text=', x.text)
      return onPage === page
    })
    .map((x) => {
      const isSelected = selected && selected.length && selected.indexOf(x.id) !== -1
      return (
        <InputWidgetItemWithPhoto key={x.id} item={x}
          selected={isSelected} onSelect={onSelect} />
      )
    })

    return (
      <section className='InputWidget' style={style}>
        <div className='InputWidget__Header'>
          {this.renderSearchBox()}
        </div>
        <div className='InputWidget__Items'>
          {rows}
        </div>
        <div className='InputWidget__Footer'>
          <div className='InputWidget__Footer__Info'>
            Found {items.length} items. Page {page} of {pages}.
          </div>
          <div className='InputWidget__Footer__Info'>
            {page > 1 ? <i className='fa fa-angle-left' onClick={() => this.onNextPage(-1)} /> : null}
            {page !== pages ? <i className='fa fa-angle-right' onClick={() => this.onNextPage(1)} /> : null}
          </div>
        </div>
      </section>
    )
  }

  renderContentWithAnimation (content) {
    return (
      <Motion
        defaultStyle={{ scale: 0.8, fade: 0 }}
        style={{ scale: spring(1, springModel), fade: spring(1) }}
      >
        {({ scale, fade }) => this.renderContent(scale, fade)}
      </Motion>
    )
  }

  render () {
    const { animate } = this.props
    if (animate) {
      return this.renderContentWithAnimation()
    }
    return this.renderContent()
  }
}

const InputWidgetItemWithPhoto = ({ item, onSelect, selected }) => (
  <div className='InputWidgetItem' onClick={() => onSelect(item.id, item.type)}>
    {item.photo && (
      <div className='InputWidgetItem__Photo'
        style={{ backgroundImage: `url(${item.photo})` }} />
    )}
    <div className='InputWidgetItem__Text'>
      <div className='InputWidgetItem__Text__Main'>{item.text}</div>
      {item.sub && <div className='InputWidgetItem__Text__Sub'>{item.sub}</div>}
    </div>
    {selected === true && (
      <div className='InputWidgetItem__Selected'>
        <i className='fa fa-check' />
      </div>
    )}
  </div>
)

InputWidget.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSearch: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  animate: React.PropTypes.bool,
  selected: React.PropTypes.array
}
