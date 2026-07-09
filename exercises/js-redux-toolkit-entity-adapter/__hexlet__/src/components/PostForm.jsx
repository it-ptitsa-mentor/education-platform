// @ts-check

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Form,
  Button,
  Row,
} from 'react-bootstrap'

import { selectors } from '../slices/usersSlice.js'
import { actions } from '../slices/postsSlice.js'
import { uniqueId } from 'es-toolkit/compat';

const PostForm = () => {
  const users = useSelector(selectors.selectAll)
  const dispatch = useDispatch()

  const onSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const post = {
      body: data.get('body'),
      author: data.get('author'),
      id: uniqueId(),
      comments: [],
    }
    dispatch(actions.addPost(post))
  }

  return (
    <div className="m-3">
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label htmlFor="body">Текст</Form.Label>
          <Form.Control name="body" id="body" as="textarea" rows={3} />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label htmlFor="postAuthor" column sm="2">
            Автор поста
          </Form.Label>
          <Form.Control name="author" id="postAuthor" as="select">
            <option value="">{null}</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3" as={Row}>
          <Button variant="primary" type="submit">
            Создать пост
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default PostForm
