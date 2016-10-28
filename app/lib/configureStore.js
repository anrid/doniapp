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
import createLogger from 'redux-logger'
import reducers from '../reducers'

let middlewares = [
  thunk,
  routerMiddleware(hashHistory)
]

function getLogger () {
  return createLogger({
    actionTransformer: (action) => {
      switch (action.type) {
        case '@@router/LOCATION_CHANGE':
          return {
            ...action,
            type: 'Route to ' + action.payload.pathname
          }
        case 'settings/SET_SETTING':
          const keyValues = Object.keys(action.payload)
          .map(x => `${x} = ${action.payload[x]}`)
          .join(', ')
          return {
            ...action,
            type: 'Set setting: ' + keyValues
          }
        default:
          return action
      }
    }
  })
}

export default function configureStore (opts = { }) {
  // Setup our store.
  if (true || process.env.NODE_ENV === 'development') {
    const logger = getLogger()
    middlewares.push(logger)
  }
  if (opts.middlewares) {
    middlewares = middlewares.concat(opts.middlewares)
  }

  const rootReducer = combineReducers(reducers)
  const enhancer = compose(applyMiddleware(...middlewares))
  const store = createStore(rootReducer, opts.initialState, enhancer)

  if (module.hot) {
    module.hot.accept(() => {
      const _reducers = require('../reducers').default
      const nextRootReducer = combineReducers(_reducers)
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
