/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

/**
 * Group an array of items by a key.
 */
export function groupBy<T, K extends string | number | symbol>(
  array: readonly T[],
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

export function assertUnreachable(_: never): never {
  throw new Error("Error! The input value was not handled.");
}
