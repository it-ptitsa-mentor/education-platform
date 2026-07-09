// @ts-check

import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import * as actions from '../actions/index.js'

const tasks = handleActions({
  [actions.addTask](state, { payload: { task } }) {
    return [...state, task]
  },
}, [])

const text = handleActions({
  [actions.addTask]() {
    return ''
  },
  [actions.updateNewTaskText](_state, { payload }) {
    return payload.text
  },
}, '')

export default combineReducers({
  tasks,
  text,
})
