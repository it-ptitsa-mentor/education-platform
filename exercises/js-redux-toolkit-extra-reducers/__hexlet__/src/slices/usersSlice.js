// @ts-check

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUsers: usersAdapter.addMany,
    removeUser: usersAdapter.removeOne,
  },
})

export const { actions } = usersSlice
export const selectors = usersAdapter.getSelectors(state => state.users)
export default usersSlice.reducer
