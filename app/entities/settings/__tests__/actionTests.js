'use strict'

const Test = require('tape')
const Sinon = require('sinon')

const Actions = require('../actions')

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
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
  t.plan(4)

  const store = mockStore({
    settings: {
      identity: null
    }
  })

  store.dispatch(Actions.login('ace@base.se', '123456'))
  .then(() => {
    const calls = store.getActions()
    // console.log(calls)
    t.ok(calls[1].type === 'settings/SET_IDENTITY')
    t.ok(calls[1].payload.email === 'ace@base.se')
    t.ok(calls[2].payload.isAppLoading)
    t.ok(calls[3].payload.args[0] === '/')
  })
})

Test('Logout test — The MockStore way', function (t) {
  t.plan(4)

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
  t.ok(calls[0].type === 'settings/SET_SETTING')
  t.ok(calls[1].type === 'settings/CLEAR_IDENTITY')
  t.ok(calls[2].type === '@@router/CALL_HISTORY_METHOD')
  t.ok(calls[2].payload.args[0] === '/login')
})

Test('Logout test — The Sinon way', function (t) {
  t.plan(4)

  const res = callAction(Actions.logout, {
    settings: {
      identity: {
        accessToken: '123456'
      }
    }
  })
  t.ok(res.dispatch.callCount === 3)
  t.ok(typeof res.dispatch.getCall(0).args[0] === 'function')
  t.ok(res.dispatch.getCall(1).args[0].type === 'settings/CLEAR_IDENTITY')
  t.ok(res.dispatch.getCall(2).args[0].type === '@@router/CALL_HISTORY_METHOD')
})

function callAction (action, state = { }) {
  const args = [...arguments].slice(1)
  const dispatch = Sinon.spy()
  const getState = () => state

  const actionOrThunk = action.apply(this, args)
  if (typeof actionOrThunk === 'function') {
    actionOrThunk(dispatch, getState)
  }
  return {
    dispatch,
    getState,
    result: actionOrThunk
  }
}
