import { createStore } from 'redux';
import omit from 'lodash/omit.js';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, [action.payload.id]: action.payload };
    case 'REMOVE_TASK':
      return omit(state, action.payload);
    default:
      return state;
  }
};

export default (initialState) => createStore(reducer, initialState);
