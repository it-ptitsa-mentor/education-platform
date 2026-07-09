// @ts-check

import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice.js'

export default configureStore({
  reducer: {
    tasks: tasksReducer,
  },
})
