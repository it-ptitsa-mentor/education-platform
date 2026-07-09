// @ts-check

import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { actions as usersActions } from '../slices/usersSlice.js'

const User = ({ user }) => {
  const dispatch = useDispatch()

  const postsEntities = useSelector((state) => {
    if (!state.posts) {
      return []
    }
    return state.posts.entities
  })

  const posts = Object.values(postsEntities).filter(item => item.author === user.id)

  const commentsEntities = useSelector((state) => {
    if (!state.comments) {
      return []
    }
    return state.comments.entities
  })

  const comments = Object.values(commentsEntities).filter(item => item.author === user.id)

  const removeUser = () => {
    dispatch(usersActions.removeUser(user.id))
  }

  return (
    <div className="mt-3">
      {user.name}
      <Button variant="primary" className="ml-3" onClick={removeUser}>
        Удалить
      </Button>
      <div className="d-flex flex-row">
        <ul className="list-group m-3 col-3">
          <li className="list-group-item active">Посты</li>
          {posts?.map(post => (<li key={post.id} className="list-group-item">{post.body}</li>))}
        </ul>
        <ul className="list-group m-3 col-3">
          <li className="list-group-item active">Комментарии</li>
          {comments?.map(comment => (<li key={comment.id} className="list-group-item">{comment.text}</li>))}
        </ul>
      </div>
      <hr />
    </div>
  )
}

export default User
