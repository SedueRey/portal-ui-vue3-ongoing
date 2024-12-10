const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  );

// Use : const grouped = groupBy(pets, pet => pet.type);

export { groupBy as default };
