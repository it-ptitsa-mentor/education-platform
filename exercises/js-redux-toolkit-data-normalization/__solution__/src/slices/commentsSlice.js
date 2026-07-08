import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const commentsAdapter = createEntityAdapter();

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    addManyComments: commentsAdapter.addMany,
  },
});

export const commentsSelectors = commentsAdapter.getSelectors((state) => state.comments);

export default commentsSlice;
