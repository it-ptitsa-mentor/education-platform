import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const postsAdapter = createEntityAdapter();

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState(),
  reducers: {
    addManyPosts: postsAdapter.addMany,
  },
});

export const postsSelectors = postsAdapter.getSelectors((state) => state.posts);

export default postsSlice;
