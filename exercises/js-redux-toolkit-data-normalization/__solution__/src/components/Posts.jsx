// @ts-check

import { useSelector } from "react-redux"

import Post from "./Post.jsx"

const Posts = () => {
  // BEGIN (write your solution here)
  const posts = useSelector((state) => {
    const { ids, entities } = state.postsReducer
    return ids.map(id => entities[id])
  })

  return (
    <div className="mt-3">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
  // END
}

export default Posts
