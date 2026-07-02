const is = (first, second) =>
  first.name === second.name &&
  first.state === second.state &&
  first.website === second.website;

export default is;
