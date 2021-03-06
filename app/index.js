'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
  Link
} from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider, connect } from 'react-redux'

import './global.css'

import Storage from './lib/storage'

// Setup the API client.
import Api from './entities/api'
import ApiClient from './lib/apiClient'

const client = new ApiClient(window.Config.WS_API_URL)
client.connect()
// client.send('echo', { value: 123 })

// Setup Redux store.
import configureStore from './lib/configureStore'

const store = configureStore({ middlewares: [
  // Connect to the API.
  Api.middleware.createApiClientMiddleware(client)
]})

// Connect Redux store with our API client.
client.setListener(data => {
  store.dispatch(Api.actions.serverMessage(data))
})

import App from './web/App'
import HomePage from './web/pages/HomePage'
import LoginPageContainer from './web/pages/LoginPageContainer'
import SignOutPageContainer from './web/pages/SignOutPageContainer'
import RetroPageContainer from './web/pages/RetroPageContainer'
import AboutPage from './web/pages/AboutPage'

import Inbox from './web/misc/Inbox'
import InboxStatsContainer from './web/misc/InboxStatsContainer'
import InboxMessageContainer from './web/misc/InboxMessageContainer'

import DemosPageContainer from './web/pages/DemosPageContainer'
import InputWidgetDemo from './web/misc/InputWidgetDemo'

const ErrorPage = ({ location }) => (
  <div>
    <div>Error Page Route, message: {location.query.message}</div>
    <Link to='/login'>Go to Login Page</Link>
  </div>
)

import Settings from './entities/settings'

function requireCredentials (nextState, replace, next) {
  // HACK-ISH: Access the store directly.
  if (Settings.selectors.isAuthenticated(store.getState())) {
    next()
  } else {
    replace('/login')
    next()
  }
}

// Init app.
Storage.get().then(data => {
  const identity = data && data.savedIdentity
  // Restore saved identity.
  if (identity) {
    console.log('Restoring saved identity:', identity)
    store.dispatch(Api.actions.authToken(identity.accessToken))
  } else {
    store.dispatch(Settings.actions.setIsAppLoading(false))
  }
})

function mapStateToProps (state, ownProps) {
  return {
    isAppLoading: Settings.selectors.isAppLoading(state)
  }
}

const AppLoader = connect(mapStateToProps)(({ isAppLoading, children }) => {
  if (isAppLoading) {
    return (
      <div className='AppLoadingScreen'>Loading app ..</div>
    )
  }
  return children
})

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

const AppRouter = () => (
  <Router history={history}>
    <Route path='/' component={App} onEnter={requireCredentials}>
      <IndexRoute component={HomePage} />
      <Route path='about' component={AboutPage} />
      <Route path='retro' component={RetroPageContainer} />
      <Route path='inbox' component={Inbox}>
        <IndexRoute component={InboxStatsContainer}/>
        <Route path='message/:id' component={InboxMessageContainer} />
      </Route>
      <Route path='signout' component={SignOutPageContainer} />
    </Route>
    <Route path='login' component={LoginPageContainer} />
    <Route path='error' component={ErrorPage} />
    <Route path='demos' component={DemosPageContainer}>
      <Route path='input-widget' component={InputWidgetDemo} />
    </Route>
  </Router>
)

const AppRoot = () => (
  <Provider store={store}>
    <AppLoader>
      <AppRouter />
    </AppLoader>
  </Provider>
)

ReactDOM.render(
  <AppRoot />,
  document.getElementById('reactapp')
)
