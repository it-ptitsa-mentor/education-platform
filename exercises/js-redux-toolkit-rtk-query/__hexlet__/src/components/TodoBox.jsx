// @ts-check
import Spinner from './Spinner.jsx'
import TodoForm from './TodoForm.jsx'
// BEGIN (write your solution here)

// END

const TodoBox = () => {
  // BEGIN (write your solution here)
  
  // END

  const handleDeleteTask = (event, id) => {
    event.preventDefault()
    // BEGIN (write your solution here)
    
    // END
  }

  const handleSubmitForm = (event, newTaskText) => {
    event.preventDefault()
    // BEGIN (write your solution here)
    
    // END
  }

  const renderTodo = () => (
    <TodoForm
      submitHandler={handleSubmitForm}
    />
  )

  // BEGIN (write your solution here)
  
  // END

  return (
    <div>
      <div className="mb-3">
        {renderTodo()}
      </div>
      <div>
        {tasks.map((task, index) => (
          <div key={task.id} className="row">
            <div className="col-1">
              {index + 1}
            </div>
            <div className="col">
              <a href="" className="todo-task" onClick={event => handleDeleteTask(event, task.id)}>{task.text}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodoBox
