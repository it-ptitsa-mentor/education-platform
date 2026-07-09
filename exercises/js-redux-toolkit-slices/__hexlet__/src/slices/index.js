// @ts-check

import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './postsSlice.js'
import usersReducer from './usersSlice.js'
// BEGIN (write your solution here)

// END

export default configureStore({
  reducer: {
    usersReducer,
    postsReducer,
    // BEGIN (write your solution here)
    
    // END
  },
})
