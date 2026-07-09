// @ts-check

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers/index.js'
import App from './components/App.jsx'

import middlewares from './middlewares.js'

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      middlewares.logger,
      middlewares.addDate,
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : args => args,
  ),
)

const mountNode = document.getElementById('container')
const root = ReactDOM.createRoot(mountNode)
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
