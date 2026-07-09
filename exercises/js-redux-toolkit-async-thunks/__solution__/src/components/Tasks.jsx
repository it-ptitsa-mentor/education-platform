// @ts-check
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

// BEGIN (write your solution here)
import { fetchTasks, removeTask, selectors } from "../slices/tasksSlice.js"
// END

const Tasks = () => {
  const dispatch = useDispatch()
  // BEGIN (write your solution here)
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const tasks = useSelector(selectors.selectAll)

  const handleRemoveTask = id => dispatch(removeTask(id))
  // END

  return tasks && (
    <div className="mt-3">
      <ul className="list-group">
        {tasks.map(({ id, name }) => (
          <li key={id} className="list-group-item d-flex align-items-center">
            <span className="me-auto">{name}</span>
            <button type="button" className="btn-close" aria-label="Remove" onClick={() => handleRemoveTask(id)}></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks
