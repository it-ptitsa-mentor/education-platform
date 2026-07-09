// @ts-check

import { useSelector } from 'react-redux'

import Post from './Post.jsx'

const Posts = () => {
  const { posts } = useSelector(state => state.postsReducer)

  return (
    <div className="mt-3">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Posts
