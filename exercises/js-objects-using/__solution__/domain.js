const getDomainInfo = (site) => {
  if (site.startsWith('https://')) {
    return { scheme: 'https', name: site.replace('https://', '') };
  }
  if (site.startsWith('http://')) {
    return { scheme: 'http', name: site.replace('http://', '') };
  }
  return { scheme: 'http', name: site };
};

export default getDomainInfo;
