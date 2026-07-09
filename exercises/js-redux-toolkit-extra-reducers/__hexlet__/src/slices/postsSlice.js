// @ts-check

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { actions as usersActions } from './usersSlice.js'

const postsAdapter = createEntityAdapter()

const initialState = postsAdapter.getInitialState()

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: postsAdapter.addMany,
    addPost: postsAdapter.addOne,
    updatePost: postsAdapter.updateOne,
    // При удалении поста передается весь пост
    removePost: (state, { payload }) => postsAdapter.removeOne(state, payload.id),
  },
  // BEGIN (write your solution here)
  
  // END
})

export const { actions } = postsSlice
export const selectors = postsAdapter.getSelectors(state => state.posts)
export default postsSlice.reducer
