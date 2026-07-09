// @ts-check

import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './postsSlice.js'
import commentsReducer from './commentsSlice.js'
import usersReducer from './usersSlice.js'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
})
