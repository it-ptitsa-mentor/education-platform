// @ts-check

import cn from 'classnames'

// BEGIN (write your solution here)
const Header = props => {
  return (
    <div className="modal-header">
      <div className="modal-title">{props.children}</div>
      <button onClick={props.toggle} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
      </button>
    </div>
  )
}
const Body = props => <div className='modal-body'>{props.children}</div>
const Footer = props => <div className='modal-footer'>{props.children}</div>

const Modal = ({ isOpen, children }) => {
  const modalClass = isOpen ? 'modal fade show' : 'modal'
  const modalStyle = { display: isOpen ? 'block' : 'none' }

  return (
    <div className={modalClass} style={modalStyle} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

export default Modal
// END
