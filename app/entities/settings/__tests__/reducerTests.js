'use strict'

import Test from 'tape'
import Reducer from '../reducer'
import * as Types from '../types'

Test('Set setting test', function (t) {
  t.plan(2)

  const state = Reducer(undefined, {
    type: Types.SET_SETTING,
    payload: {
      identity: 1,
      route: 2
    }
  })

  t.ok(state.identity === 1)
  t.ok(state.route === 2)
})

Test('Set identity test', function (t) {
  t.plan(1)

  const state = Reducer(undefined, {
    type: Types.SET_IDENTITY,
    payload: {
      email: 1,
      accessToken: 2
    }
  })

  t.deepEqual(state.identity, { email: 1, accessToken: 2 })
})
