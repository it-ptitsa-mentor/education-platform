// @ts-check

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, { payload }) {
      state.posts = payload
    },
  },
})

export const { actions } = postsSlice
export default postsSlice.reducer
