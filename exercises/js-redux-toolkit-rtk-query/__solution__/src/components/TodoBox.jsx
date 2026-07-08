import { useState } from 'react';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} from '../services/tasksApi.js';

export default function TodoBox() {
  const [text, setText] = useState('');
  const { data: tasks = [] } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await createTask({ text });
    setText('');
  };

  const handleRemove = (id) => {
    deleteTask(id);
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => handleRemove(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
