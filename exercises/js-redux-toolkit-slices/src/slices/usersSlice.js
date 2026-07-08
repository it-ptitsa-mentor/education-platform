// PROVIDED — not a student file
import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [] },
  reducers: {
    addUsers: (state, action) => {
      state.items = action.payload;
    },
  },
});

export default usersSlice;
