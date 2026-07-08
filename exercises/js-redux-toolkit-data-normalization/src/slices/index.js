// PROVIDED — not a student file
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './usersSlice.js';
import postsSlice from './postsSlice.js';
import commentsSlice from './commentsSlice.js';

export default configureStore({
  reducer: {
    users: usersSlice.reducer,
    posts: postsSlice.reducer,
    comments: commentsSlice.reducer,
  },
});
