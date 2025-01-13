const randomIntFromInterval = (min, max) => {
  const limits = min < max ? { min, max } : { min: max, max: min };
  return Math.floor(Math.random() * (limits.max - limits.min + 1) + limits.min);
};

export { randomIntFromInterval };
