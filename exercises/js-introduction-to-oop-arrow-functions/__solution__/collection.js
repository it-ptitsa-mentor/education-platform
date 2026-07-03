const each = (collection, callback) => {
  collection.forEach((item) => callback.call(item));
};

export default each;
