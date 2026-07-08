import { combineReducers } from 'redux';
import omitBy from 'lodash/omitBy.js';
import omit from 'lodash/omit.js';

const tasksReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, [action.payload.id]: action.payload };
    case 'REMOVE_TASK':
      return omit(state, action.payload);
    default:
      return state;
  }
};

const commentsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COMMENT':
      return { ...state, [action.payload.id]: action.payload };
    case 'REMOVE_TASK':
      return omitBy(state, (comment) => comment.taskId === action.payload);
    default:
      return state;
  }
};

export default combineReducers({ tasks: tasksReducer, comments: commentsReducer });
