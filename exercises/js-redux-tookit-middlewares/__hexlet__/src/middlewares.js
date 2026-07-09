/* eslint-disable @typescript-eslint/no-unused-vars */

const logger = store => next => (action) => {
  console.group(action.type)
  console.info('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const addDate = store => next => (action) => {
  // BEGIN (write your solution here)
  
  // END
}

export default { logger, addDate }
