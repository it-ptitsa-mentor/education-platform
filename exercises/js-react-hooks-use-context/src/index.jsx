// @ts-check

import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'

import App from './App.jsx'

const mountNode = document.getElementById('container')
const root = ReactDOM.createRoot(mountNode)
root.render(<App />)
