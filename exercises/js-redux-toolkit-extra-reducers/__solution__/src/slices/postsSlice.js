import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import usersSlice from './usersSlice.js';

const postsAdapter = createEntityAdapter();

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState(),
  reducers: {
    addManyPosts: postsAdapter.addMany,
    removePost: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(usersSlice.actions.removeUser, (state, action) => {
      const userId = action.payload;
      const remaining = Object.values(state.entities).filter(
        (post) => post.author !== userId,
      );
      postsAdapter.setAll(state, remaining);
    });
  },
});

export default postsSlice;
