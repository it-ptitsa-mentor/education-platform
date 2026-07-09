// @ts-check

import { combineReducers } from 'redux'
import { omitBy,omit } from 'es-toolkit/compat';

const comments = (state = {}, action) => {
  // BEGIN (write your solution here)
  switch (action.type) {
    case 'TASK_COMMENT_ADD': {
      const { comment } = action.payload
      return { ...state, [comment.id]: comment }
    }
    case 'TASK_COMMENT_REMOVE': {
      const { id } = action.payload
      return omit(state, [id])
    }
    case 'TASK_REMOVE': {
      const { id } = action.payload
      return omitBy(state, (comment) => comment.taskId === id)
    }
    default:
      return state
  }
  // END
}

const tasks = (state = {}, action) => {
  // BEGIN (write your solution here)
  switch (action.type) {
    case 'TASK_ADD': {
      const { task } = action.payload
      return { ...state, [task.id]: task }
    }
    case 'TASK_REMOVE': {
      const { id } = action.payload
      return omit(state, [id])
    }
    default:
      return state
  }
  // END
}

export default combineReducers({
  comments,
  tasks,
})
