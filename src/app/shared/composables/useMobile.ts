export function useMobile() {
  const isMobile = () => {
    return !(window && window.matchMedia('(hover: hover)').matches);
  };

  const isTouchable = () => {
    return window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches ? 'off' : 'on';
  };

  return {
    isMobile,
    isTouchable,
  };
}
