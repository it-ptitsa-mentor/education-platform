const hash = (key) => {
  let acc = 0;
  for (const char of String(key)) {
    acc = (acc * 31 + char.charCodeAt(0)) % 1000;
  }
  return acc;
};

const make = () => [];

const set = (map, key, value) => {
  const index = hash(key);
  const entry = map[index];
  if (entry !== undefined && entry[0] !== key) {
    return false;
  }
  map[index] = [key, value];
  return true;
};

const get = (map, key, defaultValue = null) => {
  const entry = map[hash(key)];
  if (entry === undefined || entry[0] !== key) {
    return defaultValue;
  }
  return entry[1];
};

export { make, set, get };
