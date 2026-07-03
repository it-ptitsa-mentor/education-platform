import * as yup from 'yup';
import axios from 'axios';

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

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (error) {
    return Object.fromEntries(
      error.inner.map(({ path, message }) => [path, message]),
    );
  }
};

export default () => {
  const container = document.querySelector('[data-container="sign-up"]');
  const form = container.querySelector('form');
  const submitButton = form.querySelector('input[type="submit"]');
  const fieldNames = ['name', 'email', 'password', 'passwordConfirmation'];

  const state = {
    values: { name: '', email: '', password: '', passwordConfirmation: '' },
    errors: {},
  };

  const render = () => {
    fieldNames.forEach((name) => {
      const input = form.elements[name];
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.remove();
      }
      input.classList.remove('is-invalid');
      if (state.errors[name]) {
        input.classList.add('is-invalid');
        const div = document.createElement('div');
        div.classList.add('invalid-feedback');
        div.textContent = state.errors[name];
        input.after(div);
      }
    });
    submitButton.disabled = Object.keys(state.errors).length > 0
      || fieldNames.every((name) => state.values[name] === '');
  };

  fieldNames.forEach((name) => {
    form.elements[name].addEventListener('input', (event) => {
      state.values[name] = event.target.value;
      state.errors = validate(state.values);
      render();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    await axios.post('/users', state.values);
    container.innerHTML = 'User Created!';
  });
};
