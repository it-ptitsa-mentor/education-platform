// PROVIDED — not a student file
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addManyUsers: usersAdapter.addMany,
    removeUser: usersAdapter.removeOne,
  },
});

export const usersSelectors = usersAdapter.getSelectors((state) => state.users);

export default usersSlice;
