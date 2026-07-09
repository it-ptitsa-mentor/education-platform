// @ts-check

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ids: [],
  entities: {},
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, { payload }) {
      const { entities, ids } = payload
      state.entities = entities
      state.ids = ids
    },
  },
})

export const { actions } = usersSlice
export default usersSlice.reducer
