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
import Home from './web/Home'
import Inbox from './web/Inbox'
import TextBox from './web/TextBox'
import LoginPageContainer from './web/LoginPageContainer.js'

const About = () => <div>About Route</div>
const InboxStats = () => <div>Inbox Stats Route</div>
const Message = ({ params }) => <div>Message Route with id #{params.id}</div>
const TextInterface = () => (
  <TextBox text={`Hello, world!\nStart typing:\n`} />
)

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
    replace('/error?message=Nope!')
    next()
  }
}

const AppRoot = () => (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App} onEnter={requireCredentials}>
        <IndexRoute component={Home} />
        <Route path='about' component={About} />
        <Route path='text' component={TextInterface} />
        <Route path='inbox' component={Inbox}>
          <IndexRoute component={InboxStats}/>
          <Route path='messages/:id' component={Message} />
        </Route>
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
