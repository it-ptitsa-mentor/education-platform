// @ts-check

import axios from "axios"

import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit"
import routes from "../routes.js"

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await axios.get(routes.tasksPath())
    return response.data.items
  },
)

// BEGIN (write your solution here)
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (name) => {
    const response = await axios.post(routes.tasksPath(), { name })
    return response.data
  },
)

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id) => {
    await axios.delete(routes.taskPath(id))
    return id
  },
)

const tasksAdapter = createEntityAdapter()

const tasksSlice = createSlice({
  name: "tasks",
  initialState: tasksAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, tasksAdapter.setAll)
      .addCase(addTask.fulfilled, tasksAdapter.addOne)
      .addCase(removeTask.fulfilled, tasksAdapter.removeOne)
  },
})

export const selectors = tasksAdapter.getSelectors(state => state.tasks)
export default tasksSlice.reducer
// END
