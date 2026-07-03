const runCode = (action, catcher) => {
  try {
    return action();
  } catch (error) {
    if (!catcher) {
      throw error;
    }
    return catcher(error);
  }
};

export default runCode;
