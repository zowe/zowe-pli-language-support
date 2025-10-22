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

import {
  isMemberSearchWithDDPath,
  isPathSearch,
  SearchOptions,
  URI,
} from "pli-language";

export async function searchFiles(
  options: SearchOptions,
  readDir: (path: string) => Promise<string[]>,
): Promise<string | undefined> {
  function readDirSafe(path: string): Promise<string[]> {
    return readDir(path).catch(() => []);
  }

  if (isPathSearch(options) || isMemberSearchWithDDPath(options)) {
    let subPath: string;
    if (isPathSearch(options)) {
      // get the path string without the starting / or drive letter
      subPath = options.path.path.substring(1);
    } else {
      // same from ddPath + member case
      const memberUri = URI.parse(`${options.ddPath}(${options.member}))`);
      subPath = memberUri.path.substring(1);
    }

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
      const fsSegment = dir.find(
        (d) => d.toLowerCase() === segment.toLowerCase(),
      );
      if (!fsSegment) {
        return undefined;
      }
      start += fsSegment + "/";
    }

    // find the last segment accounting for possible extensions
    const lastSegment = segments[segments.length - 1].toLowerCase();
    const dir = await readDirSafe(start);
    for (const file of dir) {
      const fileLower = file.toLowerCase();
      if (fileLower === lastSegment) {
        return start + file;
      }
      if (isPathSearch(options)) {
        for (const ext of options.extensions) {
          const fullName =
            lastSegment + (ext.startsWith(".") ? ext : `.${ext}`).toLowerCase();
          if (fileLower === fullName) {
            return start + file;
          }
        }
      }
    }
  } else {
    // member search w/ dirPath
    const member = `\\(${options.member}\\)`;

    /**
     * Helper to await the recursive search
     */
    async function searchDir(currentPath: string): Promise<string | undefined> {
      const entries = await readDirSafe(currentPath);
      for (const entry of entries) {
        const entryPath = currentPath.endsWith("/")
          ? currentPath + entry
          : currentPath + "/" + entry;
        if (entry.toLowerCase().endsWith(member.toLowerCase())) {
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
