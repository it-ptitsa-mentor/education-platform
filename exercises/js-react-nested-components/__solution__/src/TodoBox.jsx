// @ts-check

import { uniqueId } from 'lodash'
import Item from './Item.jsx'
import React from 'react'

// BEGIN (write your solution here)
export default class ToDoBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tasks: [], text: '' }
  }

  handleRemove = (id) => () => {
    this.setState((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { text, tasks } = this.state
    const trimmed = text.trim()
    if (!trimmed) return
    this.setState({
      tasks: [{ id: uniqueId(), text: trimmed }, ...tasks],
      text: '',
    })
  }

  render() {
    return (
      <div>
        <div className="mb-3">
          <form onSubmit={this.handleSubmit} className="d-flex">
            <div className="me-3">
              <input type="text" value={this.state.text} onChange={(e) => this.setState({ text: e.target.value })} required="" className="form-control" placeholder="I am going..." />
            </div>
            <button type="submit" className="btn btn-primary">add</button>
          </form>
        </div>
        {this.state.tasks.map((task) => (
          <Item
            key={task.id}
            task={task}
            onRemove={this.handleRemove}
          />
        ))}
      </div>
    )
  }
}
// END
