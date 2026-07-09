// @ts-check

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { actions as usersActions } from './usersSlice.js'
import { actions as postsActions } from './postsSlice.js'

const commentsAdapter = createEntityAdapter()

const initialState = commentsAdapter.getInitialState()

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComments: commentsAdapter.addMany,
    addComment: commentsAdapter.addOne,
  },
  // BEGIN (write your solution here)
  
  // END
})

export const { actions } = commentsSlice
export const selectors = commentsAdapter.getSelectors(state => state.comments)
export default commentsSlice.reducer
