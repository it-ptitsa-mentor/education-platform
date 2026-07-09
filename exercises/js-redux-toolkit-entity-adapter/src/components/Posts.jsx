// @ts-check

import React from 'react'
import { useSelector } from 'react-redux'
import Post from './Post.jsx'

import { selectors } from '../slices/postsSlice.js'

const Posts = () => {
  const posts = useSelector(selectors.selectAll)

  return (
    <div className="mt-3">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Posts
