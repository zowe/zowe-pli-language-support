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

import { isPathSearch, SearchOptions } from "pli-language";

/**
 * Searches for a file based on the provided search options & readDir function.
 * Will perform this search in a _case-insensitive_ manner by default.
 * @param options Search options to use, extended with a caseSensitive flag
 * @param readDir Helper function to read directory contents
 * @returns Matching file path if found, undefined otherwise
 */
export async function searchFiles(
  options: SearchOptions & { caseSensitive?: boolean },
  readDir: (path: string) => Promise<string[]>,
): Promise<string | undefined> {
  function readDirSafe(path: string): Promise<string[]> {
    return readDir(path).catch(() => []);
  }

  const caseSensitive = options.caseSensitive ?? false;

  /**
   * Helper for performing case-sensitive/insensitive comparison
   */
  function compare(a: string, b: string): boolean {
    return caseSensitive ? a === b : a.toLowerCase() === b.toLowerCase();
  }

  if (isPathSearch(options)) {
    const subPath = options.path.path.substring(1);

    // construct starting point, accounting for windows drive letters
    const segments = subPath.split("/");
    let start = "";
    if (subPath.charAt(1) === ":") {
      start = segments.shift() + "/";
    } else {
      start = "/";
    }

    // iterate through segments except last to find correct casing for each
    for (let i = 0; i < segments.length - 1; i++) {
      const dir = await readDirSafe(start);
      const segment = segments[i];
      const fsSegment = dir.find((d) => compare(d, segment));
      if (!fsSegment) {
        return undefined;
      }
      start += fsSegment + "/";
    }

    // find the last segment accounting for possible extensions
    const lastSegment = segments[segments.length - 1];
    const dir = await readDirSafe(start);
    for (const file of dir) {
      if (compare(file, lastSegment)) {
        return start + file;
      }
      if (isPathSearch(options)) {
        for (const ext of options.extensions) {
          const fullName =
            lastSegment + (ext.startsWith(".") ? ext : `.${ext}`);
          if (compare(file, fullName)) {
            return start + file;
          }
        }
      }
    }
  } else {
    // member search w/ dirPath
    const member = `\\(${options.member}\\)`;

    /**
     * Helper for performing case-sensitive/insensitive endsWith check
     */
    function endsWith(str: string, suffix: string): boolean {
      if (caseSensitive) {
        return str.endsWith(suffix);
      } else {
        return str.toLowerCase().endsWith(suffix.toLowerCase());
      }
    }

    /**
     * Helper to await the recursive search
     */
    async function searchDir(currentPath: string): Promise<string | undefined> {
      const entries = await readDirSafe(currentPath);
      for (const entry of entries) {
        const entryPath = currentPath.endsWith("/")
          ? currentPath + entry
          : currentPath + "/" + entry;
        if (endsWith(entry, member)) {
          return entryPath;
        }
      }
      // recurse into subdirs
      for (const entry of entries) {
        const entryPath = currentPath.endsWith("/")
          ? currentPath + entry
          : currentPath + "/" + entry;
        // attempt readDir into entryPath; if it fails, it's not a directory
        const subEntries = await readDirSafe(entryPath);
        if (subEntries.length > 0) {
          const found = await searchDir(entryPath);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    }
    return searchDir(options.dirPath.path);
  }
  return undefined;
}
