// @ts-check

import cn from 'classnames'
import React from 'react'

// BEGIN (write your solution here)
export default class Collapse extends React.Component {
  constructor(props) {
    super(props)
    this.state = { opened: props.opened }
  }

  handleClick = () => {
    this.setState({ opened: !this.state.opened })
  }

  render() {
    return (
        <div>
          <p>
            <a onClick={this.handleClick} className="btn btn-primary" data-bs-toggle="collapse" href="#" role="button" aria-expanded={this.state.opened}>Link with href</a>
          </p>
          <div className={cn('collapse', { show: this.state.opened })}>
            <div className="card card-body">
              {this.props.text}
            </div>
          </div>
        </div >
      )
  }
}

Collapse.defaultProps = { opened: true }
// END
