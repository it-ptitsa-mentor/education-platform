// @ts-check

import React from 'react'
import { useSelector } from 'react-redux'

import { selectors as commentsSelectors } from '../slices/commentsSlice.js'
import { selectors as usersSelectors } from '../slices/usersSlice.js'

const Comment = ({ commentId }) => {
  const comment = useSelector((state) => {
    const currentComment = commentsSelectors.selectById(state, commentId)
    if (!currentComment) {
      return null
    }
    return currentComment
  })
  const author = useSelector((state) => {
    if (!comment) {
      return null
    }
    const currentAuthor = usersSelectors.selectById(state, comment.author)
    return currentAuthor
  })

  if (!author || !comment) {
    return null
  }

  return (
    <>
      <h5 className="card-title">{ author.name }</h5>
      <p className="card-text">{ comment.text }</p>
    </>
  )
}

export default Comment
