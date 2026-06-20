import runCode from './runCode.js'
import { appErrorCatcher } from './catchers.js'
import AppNetworkError from './errors/AppNetworkError.js'
import NetworkError from './errors/NetworkError.js'

const successAction = () => 'Hello, Hexlet!'
const failedAction = () => {
  throw new AppNetworkError('Hexlet is unavailable!')
}
const errorHandler = err => `"Hello, Hexlet" failed with error: "${err.message}"`
const catcher1 = appErrorCatcher(errorHandler, AppNetworkError)

runCode(successAction, catcher1) // 'Hello, Hexlet!';

// Выброшена ошибка AppNetworkError, но перенаправлена в errorHandler
runCode(failedAction, catcher1) // '"Hello, Hexlet" failed with error: "Hexlet is unavailable!"';

const catcher2 = appErrorCatcher(errorHandler, NetworkError)
// Выброшена ошибка AppNetworkError, но она не соответствует NetworkError
runCode(failedAction, catcher2) // Error: 'Hexlet is unavailable!'