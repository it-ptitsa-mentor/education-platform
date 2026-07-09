// @ts-check

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './components/App.jsx'
import store from './slices/index.js'
import '~bootstrap'

const mountNode = document.getElementById('container')
const root = ReactDOM.createRoot(mountNode)
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
