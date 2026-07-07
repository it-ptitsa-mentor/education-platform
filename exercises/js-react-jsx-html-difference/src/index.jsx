// @ts-check

import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'

import Progress from './Progress.jsx'

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(<Progress percentage={40} />)
