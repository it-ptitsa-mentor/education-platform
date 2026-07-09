// @ts-check

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { actions as usersActions } from "./usersSlice.js"
import { actions as postsActions } from "./postsSlice.js"

const commentsAdapter = createEntityAdapter()

const initialState = commentsAdapter.getInitialState()

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComments: commentsAdapter.addMany,
    addComment: commentsAdapter.addOne,
  },
  // BEGIN (write your solution here)
  extraReducers: (builder) => {
    builder
      .addCase(postsActions.removePost, (state, { payload: post }) => {
        commentsAdapter.removeMany(state, post.comments)
      })
      .addCase(usersActions.removeUser, (state, { payload: userId }) => {
        const idsToRemove = Object.values(state.entities)
          .filter(comment => comment.author === userId)
          .map(comment => comment.id)
        commentsAdapter.removeMany(state, idsToRemove)
      })
  },
  // END
})

export const { actions } = commentsSlice
export const selectors = commentsAdapter.getSelectors(state => state.comments)
export default commentsSlice.reducer
