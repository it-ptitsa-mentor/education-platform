// @ts-check

import React from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import Item from './Item.jsx'
import routes from './routes.js'

// BEGIN (write your solution here)
export default class TodoBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = { tasks: [], text: '' }
  }

  async componentDidMount() {
    const res = await axios.get(routes.tasksPath())
    this.setState({ tasks: res.data })
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const res = await axios.post(routes.tasksPath(), { text: this.state.text })
    const newTasks = update(this.state.tasks, { $push: [res.data] })
    this.setState({ tasks: newTasks, text: '' })
  }

  handleTaskClick = async (task) => {
    let res
    if (task.state === 'active') {
      res = await axios.patch(routes.finishTaskPath(task.id))
    } else {
      res = await axios.patch(routes.activateTaskPath(task.id))
    }
    const idx = this.state.tasks.findIndex(t => t.id === task.id)
    const newTasks = update(this.state.tasks, { [idx]: { $merge: res.data } })
    this.setState({ tasks: newTasks })
  }

  render() {
    const { tasks, text } = this.state
    const active = tasks.filter((t) => t.state === 'active').reverse()
    const finished = tasks.filter((t) => t.state === 'finished')

    return (
      <div>
        <div className="mb-3">
          <form onSubmit={this.handleSubmit} className="todo-form mx-3">
            <div className="d-flex col-md-3">
              <input type="text"
                value={this.state.text}
                required
                className="form-control me-3"
                placeholder="I am going..."
                onChange={this.handleChange} />
              <button type="submit" className="btn btn-primary">add</button>
            </div>
          </form>
        </div>
        {active.length > 0 && <div className="todo-active-tasks">{active.map((task, i) => <Item key={task.id} task={task} index={task.id} onClick={this.handleTaskClick} />)}</div>}
        {finished.length > 0 && <div className="todo-finished-tasks">{finished.map((task, i) => <Item key={task.id} task={task} index={task.id} onClick={this.handleTaskClick} />)}</div>}
      </div>
    )
  }
}
// END