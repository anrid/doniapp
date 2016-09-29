
import { routerReducer } from 'react-router-redux'

import settings from './entities/settings'

const all = {
  settings: settings.reducer,
  routing: routerReducer
}

export default all
