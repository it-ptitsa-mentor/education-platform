// @ts-check

import React from 'react'
import { useSelector } from 'react-redux'
import { Form, Button, Row } from 'react-bootstrap'

import { selectors } from '../slices/usersSlice.js'
import { uniqueId } from 'es-toolkit/compat';

const CommentForm = ({ addComment }) => {
  const users = useSelector(selectors.selectAll)

  const onSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const comment = {
      text: data.get('text'),
      author: data.get('author'),
      id: uniqueId(),
    }
    addComment(comment)
  }

  return (
    <div className="m-3">
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label htmlFor="text">Комментарий</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="text"
            id="text"
          />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label htmlFor="author" column sm="2">
            Автор комментария
          </Form.Label>
          <Form.Control
            as="select"
            name="author"
            id="author"
          >
            <option value="">{null}</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3" as={Row}>
          <Button variant="primary" type="submit">
            Создать комментарий
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default CommentForm
