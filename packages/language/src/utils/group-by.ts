/**
 * Group an array of items by a key.
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) {
        acc[k] = [];
      }
      acc[k].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}
