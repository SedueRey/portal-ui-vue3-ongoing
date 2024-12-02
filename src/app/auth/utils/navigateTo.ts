const isSafari =
  navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

export default (url: string) => {
  if (isSafari) {
    setTimeout(() => {
      window.location.href = url;
    }, 350);
  } else {
    window.location.href = url;
  }
};
