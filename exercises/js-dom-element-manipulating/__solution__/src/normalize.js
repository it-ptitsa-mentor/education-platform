// @ts-check

import { camelCase } from 'es-toolkit';

export default (doc) => {
  doc.querySelectorAll('[class]').forEach((element) => {
    const normalized = [...element.classList].map((name) => camelCase(name));
    element.setAttribute('class', normalized.join(' '));
  });
};
