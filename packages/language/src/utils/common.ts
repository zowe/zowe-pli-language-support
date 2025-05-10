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
  fn: (value: T, key: K) => U,
): Record<K, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key as K,
      fn(value as T, key as K),
    ]),
  ) as Record<K, U>;
}

/**
 * Deeply compare two values.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual(a[key as keyof typeof a], b[key as keyof typeof b]),
  );
}
