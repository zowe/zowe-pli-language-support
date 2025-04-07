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

/**
 * Map the values of an object using a function.
 */
export function mapValues<K extends string | number | symbol, T, U>(
  obj: Record<K, T>,
  fn: (value: T) => U,
): Record<K, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key as K, fn(value as T)]),
  ) as Record<K, U>;
}
