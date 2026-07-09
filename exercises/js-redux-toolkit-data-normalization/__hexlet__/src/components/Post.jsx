// @ts-check

import { useSelector } from 'react-redux'
import Comment from './Comment.jsx'

const Post = ({ post }) => {
  const author = useSelector((state) => {
    // BEGIN (write your solution here)
    
    // END
  })

  return (
    <div className="card">
      <div className="card-header">
        {`${post.body} - ${author.name}`}
      </div>
      <div className="card-body">
        {post.comments.map(commentId => <Comment key={commentId} commentId={commentId} />)}
      </div>
    </div>
  )
}

export default Post
