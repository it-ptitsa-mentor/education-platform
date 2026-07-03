import AppError from './errors/AppError.js';

export const anyErrorCatcher = (errorHandler, errorInstance) => (error) => {
  if (error instanceof errorInstance) {
    return errorHandler(error);
  }
  throw error;
};

export const appErrorCatcher = (errorHandler, errorInstance) => (error) => {
  if (error instanceof errorInstance && error instanceof AppError) {
    return errorHandler(error);
  }
  throw error;
};

export const customErrorCatcher = (errorHandler, errorInstance) => (error) => {
  if (!errorInstance && error.isCustomError === true) {
    return errorHandler(error);
  }
  throw error;
};
