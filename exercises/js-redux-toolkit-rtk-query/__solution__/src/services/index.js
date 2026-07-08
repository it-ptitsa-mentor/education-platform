import { configureStore } from '@reduxjs/toolkit';
import tasksApi from './tasksApi.js';

export default configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});
