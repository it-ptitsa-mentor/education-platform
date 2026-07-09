// @ts-check

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment.jsx'
import CommentForm from './CommentForm.jsx'
import { actions as postsActions } from '../slices/postsSlice.js'
import { actions as commentsActions } from '../slices/commentsSlice.js'
import { selectors } from '../slices/usersSlice.js'

const Post = ({ post }) => {
  const author = useSelector(state => selectors.selectById(state, post.author))
  const dispatch = useDispatch()

  const addComment = (comment) => {
    dispatch(postsActions.updatePost({
      id: post.id,
      changes: {
        comments: [...post.comments, comment.id],
      },
    }))
    dispatch(commentsActions.addComment(comment))
  }

  return (
    <div className="card mb-5">
      <div className="card-header">
        {`${post.body} - ${author.name}`}
      </div>
      <div className="card-body">
        {post.comments.map(commentId => <Comment key={commentId} commentId={commentId} />)}
        <hr />
        <CommentForm addComment={addComment} />
      </div>

    </div>
  )
}

export default Post
