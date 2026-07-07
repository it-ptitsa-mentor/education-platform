// @ts-check

import ReactDOM from 'react-dom/client'

import Carousel from './Carousel.jsx'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const images = ['/images/first.jpeg', '/images/second.jpeg', '/images/third.jpeg']

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(<Carousel images={images} />)
