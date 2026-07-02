const fillWithFirst = (coll) => {
  for (let i = 1; i < coll.length; i += 1) {
    coll[i] = coll[0];
  }
};

export { fillWithFirst };
export default fillWithFirst;
