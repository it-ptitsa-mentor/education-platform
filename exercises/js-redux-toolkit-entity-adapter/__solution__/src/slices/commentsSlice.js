// @ts-check

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

// BEGIN (write your solution here)
const commentsAdapter = createEntityAdapter()

const commentsSlice = createSlice({
  name: "comments",
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    addComment: commentsAdapter.addOne,
    addComments: commentsAdapter.addMany,
  },
})

export const { actions } = commentsSlice
export const selectors = commentsAdapter.getSelectors(state => state.comments)
export default commentsSlice.reducer
// END
