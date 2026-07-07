import ReactDOM from 'react-dom/client'
import uniqueId from 'lodash/uniqueId'

import DefinitionsList from './DefinitionsList.jsx'

const definitions = [
  { dt: 'one', dd: 'two', id: uniqueId() },
  { dt: 'another term', dd: 'another description', id: uniqueId() },
]

const root = ReactDOM.createRoot(document.getElementById('container'))
root.render(<DefinitionsList data={definitions} />)
