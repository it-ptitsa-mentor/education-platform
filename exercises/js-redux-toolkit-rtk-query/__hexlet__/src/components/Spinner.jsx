// @ts-check

import Spinner from 'react-bootstrap/Spinner'

const CustomSpinner = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
)

export default CustomSpinner
