const bind = (obj, fn) => (...args) => fn.apply(obj, args);

export default bind;
