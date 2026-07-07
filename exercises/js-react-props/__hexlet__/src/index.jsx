// @ts-check

import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'

import Card from './Card.jsx'

const title = 'Title'
const text = 'Description'

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(<Card title={title} text={text} />)
