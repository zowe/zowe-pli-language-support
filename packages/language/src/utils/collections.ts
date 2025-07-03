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
 * MultiMap taken from Langium.
 */

export class MultiMap<K, V> {
  private map = new Map<K, V[]>();

  constructor();
  constructor(elements: Array<[K, V]>);
  constructor(elements?: Array<[K, V]>) {
    if (elements) {
      for (const [key, value] of elements) {
        this.add(key, value);
      }
    }
  }

  /**
   * Clear all entries in the multimap.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Operates differently depending on whether a `value` is given:
   *  * With a value, this method deletes the specific key / value pair from the multimap.
   *  * Without a value, all values associated with the given key are deleted.
   *
   * @returns `true` if a value existed and has been removed, or `false` if the specified
   *     key / value does not exist.
   */
  delete(key: K, value?: V): boolean {
    if (value === undefined) {
      return this.map.delete(key);
    } else {
      const values = this.map.get(key);
      if (values) {
        const index = values.indexOf(value);
        if (index >= 0) {
          if (values.length === 1) {
            this.map.delete(key);
          } else {
            values.splice(index, 1);
          }
          return true;
        }
      }
      return false;
    }
  }

  /**
   * Returns an array of all values associated with the given key. If no value exists,
   * an empty array is returned.
   *
   * _Note:_ The returned array is assumed not to be modified. Use the `set` method to add a
   * value and `delete` to remove a value from the multimap.
   */
  get(key: K): readonly V[] {
    return this.map.get(key) ?? [];
  }

  /**
   * Operates differently depending on whether a `value` is given:
   *  * With a value, this method returns `true` if the specific key / value pair is present in the multimap.
   *  * Without a value, this method returns `true` if the given key is present in the multimap.
   */
  has(key: K, value?: V): boolean {
    if (value === undefined) {
      return this.map.has(key);
    } else {
      const values = this.map.get(key);
      if (values) {
        return values.indexOf(value) >= 0;
      }
      return false;
    }
  }

  /**
   * Add the given key / value pair to the multimap.
   */
  add(key: K, value: V): this {
    if (this.map.has(key)) {
      this.map.get(key)!.push(value);
    } else {
      this.map.set(key, [value]);
    }
    return this;
  }

  /**
   * Add the given set of key / value pairs to the multimap.
   */
  addAll(key: K, values: Iterable<V>): this {
    if (this.map.has(key)) {
      this.map.get(key)!.push(...values);
    } else {
      this.map.set(key, Array.from(values));
    }
    return this;
  }

  /**
   * Invokes the given callback function for every key / value pair in the multimap.
   */
  forEach(callbackfn: (value: V, key: K, map: this) => void): void {
    this.map.forEach((array, key) =>
      array.forEach((value) => callbackfn(value, key, this)),
    );
  }

  /**
   * Returns a stream of key, value pairs for every entry in the map.
   */
  entries(): [K, V][] {
    return Array.from(this.map.entries(), ([key, array]) =>
      array.map((value) => [key, value] as [K, V]),
    ).flat();
  }

  /**
   * Returns a stream of keys in the map.
   */
  keys(): MapIterator<K> {
    return this.map.keys();
  }

  keysArray(): K[] {
    return Array.from(this.map.keys());
  }

  /**
   * Returns a stream of values in the map.
   */
  values(): V[] {
    return Array.from(this.map.values()).flatMap((a) => a);
  }

  /**
   * Returns a stream of key, value set pairs for every key in the map.
   */
  entriesGroupedByKey(): MapIterator<[K, V[]]> {
    return this.map.entries();
  }

  extend(other: MultiMap<K, V>): this {
    for (const [key, values] of other.entriesGroupedByKey()) {
      this.addAll(key, values);
    }

    return this;
  }
}
