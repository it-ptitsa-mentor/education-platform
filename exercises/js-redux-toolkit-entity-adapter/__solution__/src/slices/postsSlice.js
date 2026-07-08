import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const postsAdapter = createEntityAdapter();

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState(),
  reducers: {
    addOnePost: postsAdapter.addOne,
    addManyPosts: postsAdapter.addMany,
    updateOnePost: postsAdapter.updateOne,
  },
});

export const postsSelectors = postsAdapter.getSelectors((state) => state.posts);

export default postsSlice;
