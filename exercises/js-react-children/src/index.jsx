// @ts-check

import ReactDOM from 'react-dom/client'

import ListGroup from './ListGroup.jsx'

const dom = (
  <ListGroup>
    <p>one</p>
    <p>two</p>
  </ListGroup>
)

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(dom)
