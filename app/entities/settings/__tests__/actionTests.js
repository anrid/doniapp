'use strict'

import Test from 'tape'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as Actions from '../actions'
import * as Types from '../types'
import Api from '../../api'

const mockStore = configureStore([thunk])

Test('Timing test', function (t) {
  t.plan(2)

  t.equal(typeof Date.now, 'function')
  const start = Date.now()

  setTimeout(function () {
    t.ok(Date.now() - start >= 100)
  }, 100)
})

Test('Login test', function (t) {
  t.plan(3)

  const store = mockStore({
    settings: {
      identity: null
    }
  })

  store.dispatch(Actions.login('ace@base.se', '123456'))

  const calls = store.getActions()
  t.ok(calls[0].type === Api.types.LOGIN)
  t.ok(calls[0].topic)
  t.ok(calls[0].payload.email === 'ace@base.se')
})

Test('Login successful test', function (t) {
  t.plan(5)

  const store = mockStore({
    settings: {
      identity: null
    }
  })
  const identity = {
    email: 'ace@base.se',
    accessToken: 'ABC123'
  }

  store.dispatch(Actions.loginSuccessful({ identity }))

  const calls = store.getActions()
  // console.log('calls=', calls)
  t.ok(calls[0].type === Types.SET_IDENTITY)
  t.deepEqual(calls[0].payload, identity)
  t.ok(calls[1].type === Types.SET_SETTING)
  t.ok(calls[2].type === Api.types.STARTER)
  t.ok(calls[3].payload.args[0] === '/')
})

Test('Logout test', function (t) {
  t.plan(3)

  const store = mockStore({
    settings: {
      identity: {
        accessToken: '123456'
      }
    }
  })

  store.dispatch(Actions.logout())

  const calls = store.getActions()
  // console.log('actions:', store.getActions())
  t.ok(calls[0].type === Api.types.LOGOUT)
  t.ok(calls[1].type === Types.CLEAR_IDENTITY)
  t.ok(calls[2].payload.args[0] === '/login')
})
