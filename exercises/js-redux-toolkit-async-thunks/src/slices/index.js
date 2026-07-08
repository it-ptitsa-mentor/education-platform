// PROVIDED — not a student file
import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice.js';

export default configureStore({
  reducer: {
    tasksState: tasksSlice.reducer,
  },
});
