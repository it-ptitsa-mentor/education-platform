// @ts-check

import { useState } from "react"
import { useDispatch } from "react-redux"

// BEGIN (write your solution here)
import { addTask } from "../slices/tasksSlice.js"
// END

const NewTaskForm = () => {
  const [name, setName] = useState("")
  const dispatch = useDispatch()

  const handleAddTask = (e) => {
    // BEGIN (write your solution here)
    e.preventDefault()
    dispatch(addTask(name))
    setName("")
    // END
  }

  const onChange = e => setName(e.target.value)

    return (
      <form action="" className="row g-3 align-items-center" onSubmit={handleAddTask}>
        <div className="col-auto">
          <input
            type="text"
            data-testid="input"
            className="form-control"
            required
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="col-auto">
          <input type="submit" data-testid="submit" className="btn btn-primary btn-sm" value="Add" />
        </div>
      </form>
    )
  }


export default NewTaskForm
