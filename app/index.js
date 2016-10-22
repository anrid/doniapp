'use strict'

import React, { Component, PropTypes } from 'react'
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

import Storage from './lib/storage'

// Setup the API client.
import Api from './entities/api'
import ApiClient from './lib/apiClient'

const client = new ApiClient(window.Config.WS_API_URL)
client.connect()
client.send('echo', { value: 123 })

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

class AppLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount () {
    Storage.get()
    .then(data => {
      if (data) {
        // Restore saved identity.
        if (data.savedIdentity) {
          console.log('Restoring saved identity:', data.savedIdentity.identity)
          store.dispatch(Settings.actions.loadSavedIdentity(data.savedIdentity.identity))
        }
      }
      setTimeout(() => this.setState({ isLoading: false }), 250)
    })
  }

  render () {
    const { isLoading } = this.state
    const Root = this.props.root
    if (isLoading) {
      return <div className='AppLoadingScreen'>Loading app ..</div>
    }
    return <Root />
  }
}

AppLoader.propTypes = {
  root: PropTypes.any.isRequired
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
      <Route path='login' component={LoginPageContainer} />
      <Route path='error' component={ErrorPage} />
      <Route path='demos' component={DemosPageContainer}>
        <Route path='input-widget' component={InputWidgetDemo} />
      </Route>
    </Router>
  </Provider>
)

ReactDOM.render(
  <AppLoader root={AppRoot} />,
  document.getElementById('reactapp')
)
