// Реализуйте контролируемую форму регистрации и экспортируйте
// функцию приложения по умолчанию. Разметка — в public/index.html.
// Схема валидации уже описана ниже — используйте её

import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.string().trim(),
  email: yup
    .string()
    .required()
    .email('Value is not a valid email'),
  password: yup
    .string()
    .required()
    .min(6, 'Must be at least 6 letters'),
  passwordConfirmation: yup
    .string()
    .required('password confirmation is a required field')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
