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

import { SearchOptions } from "pli-language";

export async function searchFiles(
  options: SearchOptions,
  readDir: (path: string) => Promise<string[]>,
): Promise<string | undefined> {
  function readDirSafe(path: string): Promise<string[]> {
    return readDir(path).catch(() => []);
  }
  const string = options.path.path.substring(1);
  const segments = string.split("/");
  let start = "";
  if (string.charAt(1) === ":") {
    start = segments.shift() + "/";
  } else {
    start = "/";
  }
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
  const lastSegment = segments[segments.length - 1].toLowerCase();
  const dir = await readDirSafe(start);
  for (const file of dir) {
    const fileLower = file.toLowerCase();
    if (fileLower === lastSegment) {
      return start + file;
    }
    for (const ext of options.extensions) {
      const fullName =
        lastSegment + (ext.startsWith(".") ? ext : `.${ext}`).toLowerCase();
      if (fileLower === fullName) {
        return start + file;
      }
    }
  }
  return undefined;
}
