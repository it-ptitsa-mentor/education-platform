// @ts-check

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Posts from './Posts.jsx'
import routes from '../routes.js'
import PostForm from './PostForm.jsx'

import { actions as usersActions } from '../slices/usersSlice.js'
import { actions as postsActions } from '../slices/postsSlice.js'
import { actions as commentsActions } from '../slices/commentsSlice.js'

import getNormalized from '../utilities/getNormalized.js'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.getData())
      const normalizedData = getNormalized(data)
      const {
        users,
        posts,
        comments,
      } = normalizedData.entities

      dispatch(usersActions.addUsers(users))
      dispatch(postsActions.addPosts(posts))
      dispatch(commentsActions.addComments(comments))
    }

    fetchData()
  })

  return (
    <>
      <div className="card">
        <div className="card-header">
          Создать пост
        </div>
        <div className="card-body">
          <PostForm />
        </div>
      </div>
      <div className="mt-5">
        <Posts />
      </div>
    </>
  )
}

export default App
