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
import { Provider } from 'react-redux'

import './global.css'

import configureStore from './configureStore'
const store = configureStore()

import App from './web/App'
import HomePage from './web/pages/HomePage'
import LoginPageContainer from './web/pages/LoginPageContainer'
import SignOutPageContainer from './web/pages/SignOutPageContainer'
import RetroPageContainer from './web/pages/RetroPageContainer'
import AboutPage from './web/pages/AboutPage'

import Inbox from './web/misc/Inbox'
import InboxStatsContainer from './web/misc/InboxStatsContainer'
import InboxMessageContainer from './web/misc/InboxMessageContainer'

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

const AppRoot = () => (
  <Provider store={store}>
    <Router history={hashHistory}>
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
      <Route path='/login' component={LoginPageContainer} />
      <Route path='/error' component={ErrorPage} />
    </Router>
  </Provider>
)

ReactDOM.render(
  <AppRoot />,
  document.getElementById('reactapp')
)
