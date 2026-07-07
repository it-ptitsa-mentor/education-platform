import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'

import Card from './Card.jsx'

const dom = (
  <Card>
    <Card.Body>
      <Card.Title>Title</Card.Title>
      <Card.Text>Text</Card.Text>
    </Card.Body>
  </Card>
)

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(dom)
