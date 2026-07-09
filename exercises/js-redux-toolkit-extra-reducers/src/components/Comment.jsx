// @ts-check

import { useSelector } from 'react-redux'

import { selectors as commentsSelectors } from '../slices/commentsSlice.js'
import { selectors as usersSelectors } from '../slices/usersSlice.js'

const Comment = ({ commentId }) => {
  const comment = useSelector(state => commentsSelectors.selectById(state, commentId))
  const author = useSelector(state => usersSelectors.selectById(state, comment?.author))

  return (
    <>
      <h5 className="card-title">{ author ? author.name : '' }</h5>
      <p className="card-text">{ comment ? comment.text : '' }</p>
    </>
  )
}

export default Comment
