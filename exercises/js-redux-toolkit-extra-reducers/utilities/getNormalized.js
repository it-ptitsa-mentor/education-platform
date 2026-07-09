const getNormalized = (data) => {
  const entities = {
    users: {},
    comments: {},
    posts: {},
  }

  const result = []

  data.forEach((post) => {
    const {
      id: postId, author, comments: postComments, ...restPost
    } = post

    entities.users[author.id] = author

    const normalizedPost = {
      id: postId,
      author: author.id,
      comments: [],
      ...restPost,
    }

    postComments.forEach((comment) => {
      const { id: commentId, author: commentAuthor, ...restComment } = comment

      entities.users[commentAuthor.id] = commentAuthor

      entities.comments[commentId] = {
        id: commentId,
        author: commentAuthor.id,
        ...restComment,
      }

      normalizedPost.comments.push(commentId)
    })

    entities.posts[postId] = normalizedPost
    result.push(postId)
  })

  return {
    entities,
    result,
  }
}

export default getNormalized
