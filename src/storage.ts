const isSafari =
  navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

export default {
  getItem: (key) =>
    isSafari ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key),
  removeItem: (key) =>
    isSafari ? window.localStorage.removeItem(key) : window.sessionStorage.removeItem(key),
  setItem: (key, value) =>
    isSafari ? window.localStorage.setItem(key, value) : window.sessionStorage.setItem(key, value),
};
