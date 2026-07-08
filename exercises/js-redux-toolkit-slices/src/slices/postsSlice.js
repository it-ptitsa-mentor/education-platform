// PROVIDED — not a student file
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [] },
  reducers: {
    addPosts: (state, action) => {
      state.items = action.payload;
    },
  },
});

export default postsSlice;
