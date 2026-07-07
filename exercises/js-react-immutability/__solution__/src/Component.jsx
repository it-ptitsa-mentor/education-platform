import uniqueId from 'lodash/uniqueId'
import React from 'react'

// BEGIN (write your solution here)
export default class Component extends React.Component {
  constructor(props) {
    super(props)
    this.state = { log: [] }
  }

  handleIncClick = () => {
    const top = this.state.log[0]?.value ?? 0
    this.setState({
      log: [{ id: uniqueId(), value: top + 1 }, ...this.state.log],
    })
  }

  handleDecClick = () => {
    const top = this.state.log[0]?.value ?? 0
    this.setState({
      log: [{ id: uniqueId(), value: top - 1 }, ...this.state.log],
    })
  }

  handleRemove = (index) => () => {
    this.setState((state) => ({
      log: state.log.filter((_, i) => i !== index),
    }))
  }

  render() {
    return (
      <div>
        <div className="btn-group font-monospace" role="group">
          <button
            onClick={this.handleIncClick}
            type="button"
            className="btn btn-outline-success"
          >
            +
          </button>
          <button
            onClick={this.handleDecClick}
            type="button"
            className="btn btn-outline-danger"
          >
            -
          </button>
        </div>
        {this.state.log.length > 0 && (
          <div className="list-group mt-3">
            {this.state.log.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={this.handleRemove(index)}
              >
                {entry.value}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
}
// END