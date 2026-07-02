const normalizeUrl = (address) => {
  if (address.startsWith('https://')) {
    return address;
  }
  return `https://${address}`;
};

export default normalizeUrl;
