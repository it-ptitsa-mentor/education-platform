// @ts-check

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ids: [],
  entities: {},
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments(state, { payload }) {
      // BEGIN (write your solution here)
      
      // END
    },
  },
})

export const { actions } = commentsSlice
export default commentsSlice.reducer
