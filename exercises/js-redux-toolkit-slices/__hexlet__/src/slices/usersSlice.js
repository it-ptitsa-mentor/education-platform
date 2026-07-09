// @ts-check

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, { payload }) {
      state.users = payload
    },
  },
})

export const { actions } = usersSlice
export default usersSlice.reducer
