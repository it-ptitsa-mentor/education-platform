// @ts-check

export default (url) => {
  window.location.assign(url);
  const browser = window.navigator.userAgent.split(' ')[0];
  return `${browser} ${url}`;
};
