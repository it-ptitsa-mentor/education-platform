import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../slices/tasksSlice.js';

export default function NewTaskForm() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(addTask(name));
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New task"
      />
      <button type="submit">Add</button>
    </form>
  );
}
