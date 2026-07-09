// @ts-check

import axios from 'axios'

import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import routes from '../routes.js'

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await axios.get(routes.tasksPath())
    return response.data.items
  },
)

// BEGIN (write your solution here)

// END
