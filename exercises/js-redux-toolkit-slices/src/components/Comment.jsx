// @ts-check

import { useSelector } from 'react-redux'

const Comment = ({ commentId }) => {
  // BEGIN (write your solution here)

  // END

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
