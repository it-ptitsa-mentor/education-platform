import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, removeTask } from '../slices/tasksSlice.js';

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasksState.items);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleRemoveTask = (id) => {
    dispatch(removeTask(id));
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.name}
          <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
