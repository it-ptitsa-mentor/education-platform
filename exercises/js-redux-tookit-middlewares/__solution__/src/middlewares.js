export const addDate = () => (_storeAPI) => (next) => (action) => {
  if (action.type === 'ADD_TASK') {
    const date = new Date().toLocaleDateString('ru-RU');
    const modifiedAction = {
      ...action,
      payload: {
        ...action.payload,
        task: {
          ...action.payload.task,
          text: `Задача на ${date}: ${action.payload.task.text}`,
        },
      },
    };
    return next(modifiedAction);
  }
  return next(action);
};
