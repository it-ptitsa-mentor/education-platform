// @ts-check

import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import Products from './Products.jsx'

const mountNode = document.getElementById('container')
const root = ReactDOM.createRoot(mountNode)
root.render(<Products />)
