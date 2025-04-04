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
