// @ts-check

import 'bootstrap/dist/css/bootstrap.min.css'

import { useState } from 'react'
import ReactDOM from 'react-dom/client'

import MaskedInput from './MaskedInput.jsx'

const App = () => {
  const [value, setValue] = useState('')

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Маска ввода телефона</h5>
        <div className="mb-3">
          <label className="form-label w-100">
            Телефон
            <MaskedInput onAccept={setValue} />
          </label>
        </div>
        <div className="text-muted">Текущее значение: {value || '—'}</div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(<App />)
