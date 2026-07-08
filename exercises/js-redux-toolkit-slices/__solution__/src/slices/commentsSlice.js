import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: { items: [] },
  reducers: {
    addComments: (state, action) => {
      state.items = action.payload;
    },
  },
});

export default commentsSlice;
