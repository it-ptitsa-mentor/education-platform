// @ts-check

import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './postsSlice.js'
import commentsReducer from './commentsSlice.js'
import usersReducer from './usersSlice.js'

export default configureStore({
  reducer: {
    usersReducer,
    postsReducer,
    commentsReducer,
  },
})
