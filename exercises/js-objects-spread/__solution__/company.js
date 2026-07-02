const make = (name, properties = {}) => ({
  state: 'moderating',
  createdAt: Date.now(),
  ...properties,
  name,
});

export default make;
