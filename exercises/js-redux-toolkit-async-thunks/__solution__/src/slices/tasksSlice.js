import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const response = await axios.get(routes.tasks());
  return response.data.items;
});

export const addTask = createAsyncThunk('tasks/add', async (name) => {
  const response = await axios.post(routes.tasks(), { name });
  return response.data;
});

export const removeTask = createAsyncThunk('tasks/remove', async (id) => {
  await axios.delete(routes.task(id));
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loadingStatus: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loadingStatus = 'idle';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loadingStatus = 'idle';
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.loadingStatus = 'idle';
      });
  },
});

export default tasksSlice;
