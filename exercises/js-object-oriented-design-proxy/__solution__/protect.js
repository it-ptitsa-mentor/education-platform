const protect = (obj, protectedProps) => new Proxy(obj, {
  get(target, prop) {
    if (protectedProps.includes(prop)) {
      throw new Error(`Access to '${prop}' is restricted`);
    }
    return target[prop];
  },
  set(target, prop, value) {
    if (protectedProps.includes(prop)) {
      throw new Error(`Access to '${prop}' is restricted`);
    }
    target[prop] = value;
    return true;
  },
});

export default protect;
