// @ts-check

// BEGIN (write your solution here)
const Item = (props) => {
  const handleClick = (e) => {
    e.preventDefault()
    props.onClick(props.task)
  }

  return (
    <div className="row">
      <div className="col-1">{props.index}</div>
      <div className="col">
        {
          props.task.state === 'finished' ?
            <s><a onClick={handleClick} href="#" className="todo-task">{props.task.text}</a></s> :
            <a onClick={handleClick} href="#" className="todo-task">{props.task.text}</a>
        }
      </div>
    </div>
  )
}
export default Item
// END
