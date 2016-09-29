'use strict'

import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux'

import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers'

const middlewares = [
  thunk,
  routerMiddleware(hashHistory)
]

export default function configureStore (opts = { }) {
  // Setup our store.
  if (true || process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger')
    const logger = createLogger()
    middlewares.push(logger)
  }

  const rootReducer = combineReducers(reducers)
  const enhancer = compose(applyMiddleware(...middlewares))
  const store = createStore(rootReducer, opts.initialState, enhancer)

  if (module.hot) {
    module.hot.accept(() => {
      const _reducers = require('./reducers').default
      const nextRootReducer = combineReducers(_reducers)
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
