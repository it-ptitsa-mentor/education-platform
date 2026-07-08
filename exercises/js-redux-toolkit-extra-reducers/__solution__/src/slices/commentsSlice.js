import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import usersSlice from './usersSlice.js';
import postsSlice from './postsSlice.js';

const commentsAdapter = createEntityAdapter();

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    addManyComments: commentsAdapter.addMany,
    addOneComment: commentsAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(usersSlice.actions.removeUser, (state, action) => {
      const userId = action.payload;
      const remaining = Object.values(state.entities).filter(
        (comment) => comment.author !== userId,
      );
      commentsAdapter.setAll(state, remaining);
    });
    builder.addCase(postsSlice.actions.removePost, (state, action) => {
      const post = action.payload;
      const postId = typeof post === 'object' ? post.id : post;
      const remaining = Object.values(state.entities).filter(
        (comment) => comment.postId !== postId,
      );
      commentsAdapter.setAll(state, remaining);
    });
  },
});

export default commentsSlice;
