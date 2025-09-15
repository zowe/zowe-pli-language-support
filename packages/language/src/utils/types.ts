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

export type UnknownObject<T extends Object> = { [K in keyof T]: unknown };

export function isObject<T extends Object>(
  item: unknown,
): item is UnknownObject<T> {
  return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}

export function isRecordOf<T extends Object>(
  item: unknown,
  elementCheck: (elem: unknown) => elem is T,
): item is Record<string, T> {
  return (
    isObject<Record<string, unknown>>(item) &&
    Object.values(item).every(elementCheck)
  );
}

export function isArrayOf<T>(
  item: unknown,
  elementCheck: (elem: unknown) => elem is T,
): item is T[] {
  return Array.isArray(item) && item.every(elementCheck);
}

export function isString(item: unknown): item is string {
  return typeof item === "string";
}

export function isNumber(item: unknown): item is number {
  return typeof item === "number";
}

export function isStringArray(item: unknown): item is string[] {
  return isArrayOf(item, isString);
}

export function isBoolean(item: unknown): item is boolean {
  return typeof item === "boolean";
}
