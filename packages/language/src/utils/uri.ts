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

import { URI, Utils } from "vscode-uri";
import { capitalize } from "../preprocessor/util";
export { URI };

export namespace UriUtils {
  export const basename = Utils.basename;
  export const dirname = Utils.dirname;
  export const extname = Utils.extname;
  export const joinPath = Utils.joinPath;
  export const resolvePath = Utils.resolvePath;

  export const isWindows =
    typeof process === "object" && process?.platform === "win32";

  export const isWindowsAbsolutePath = (path: string) =>
    path.charAt(1) === ":" &&
    path.charAt(2) === "/" &&
    /^[a-zA-Z]/.test(path.charAt(0));
  export const isUnixAbsolutePath = (path: string) => path.startsWith("/");

  export function equals(a?: URI | string, b?: URI | string): boolean {
    return a?.toString() === b?.toString();
  }

  /**
   * Processes Windows drive letters in a path.
   * - Removes leading slash before drive letter (e.g., "/C:/" → "C:/")
   * - Extracts and returns the drive letter if present
   *
   * @returns Object with normalized path and extracted drive letter
   */
  function processDriveLetter(path: string): {
    path: string;
    drive: string | null;
  } {
    // Check for leading slash before drive: /C:/ or /c:/
    if (/^\/[a-zA-Z]:\//.test(path)) {
      const drive = path.substring(1, 3); // Extract "C:" and lowercase
      return {
        path: path.substring(1), // Remove leading slash
        drive: drive,
      };
    }

    // Check for drive letter without leading slash: C:\ or C:/
    const match = path.match(/^([a-zA-Z]:)[\\\/]/);
    if (match) {
      return {
        path: path,
        drive: match[1],
      };
    }

    // No drive letter found
    return {
      path: path,
      drive: null,
    };
  }

  export function stringPath(path: URI | string): {
    result: string;
    driveLetter: string | null;
  } {
    let result = typeof path === "string" ? URI.parse(path).path : path.path;

    // Normalize possible leading slash before Windows drive and isolate windows drive letter if present
    const { path: normalizedPath, drive: driveLetter } =
      processDriveLetter(result);
    result = normalizedPath;

    // Remove drive letter if present
    if (driveLetter) {
      result = result.replace(driveLetter, "");
    }

    // Normalize slashes
    result = result.replace(/\\/g, "/");

    return { result, driveLetter };
  }

  export function isPathRelative(path: string) {
    if (path.startsWith("../") || path.startsWith("./")) {
      return true;
    }
    const startsWithLetter = /^[a-zA-Z]/.test(path.charAt(0));
    const isAbsolute = isWindowsAbsolutePath(path) || isUnixAbsolutePath(path);
    return startsWithLetter && !isAbsolute;
  }

  // TODO: 04.02.2026 @wagner-laranjeiras
  // In our test environment, sometimes the toPath is evaluated as a single slash ("/"),
  // which can break the logic and return a relative path when an absolute should be given.
  // This is a workaround, but a refactor regarding the URI handling in the project is needed.
  // See GitHub Issue #568
  function normalizeForWindowsTests(path: string) {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return path;
  }

  export function relative(from: URI | string, to: URI | string): string {
    const { result: fromPath } = stringPath(from);
    const { result: toPath, driveLetter } = stringPath(to);

    const fromParts = fromPath.split("/").filter((e) => e.length > 0);
    const toParts = toPath.split("/").filter((e) => e.length > 0);

    const shareWorkspace = Boolean(
      fromParts.length && fromParts[0] === toParts[0],
    );
    if (isWindows && !shareWorkspace) {
      const windowsPath = driveLetter ? driveLetter + toPath : toPath;
      return normalizeForWindowsTests(windowsPath);
    }
    let commonFolders = 0;
    for (; commonFolders < fromParts.length; commonFolders++) {
      if (fromParts[commonFolders] !== toParts[commonFolders]) {
        break;
      }
    }
    if (fromParts.length - commonFolders > 1) {
      return typeof to === "string" ? toPath : to.path;
    }

    let toPart = toParts.slice(commonFolders).join("/");
    if (commonFolders === 0) {
      toPart = "/" + toPart;
    }
    if (fromPath === "/") {
      toPart = toPart.replace("/", "");
    }
    return toPart;
  }

  /**
   * Removes leading character and capitalizes the first letter of the resulting string.
   * Typically used to normalize Windows drive letters (e.g., "/c:/path" → "C:/path").
   */
  export function handleDriveLetter(path: string): string {
    path = path.substring(1);
    return capitalize(path);
  }

  /**
   * Computes a relative path from one location to another.
   * Ensures the result is prefixed with `./` for relative paths or returns
   * an absolute fallback when paths cannot be related (e.g., different drives on Windows).
   */
  export function relativeDisplayPath(
    from: string,
    to: string,
    fallback = to,
    isWindows = UriUtils.isWindows,
  ): string {
    let relative = UriUtils.relative(from, to);
    if (UriUtils.isPathRelative(relative)) {
      relative = "./" + relative;
      return relative;
    }
    const { result, driveLetter } = stringPath(fallback);
    // WINDOWS
    if (isWindows) {
      return `${driveLetter}${result}`;
    }
    // UNIX
    if (UriUtils.isUnixAbsolutePath(relative)) {
      return result;
    }
    return relative;
  }

  export function normalize(uri: URI | string): string {
    return URI.parse(uri.toString()).toString();
  }

  /**
   * Compute workspace-relative parent folder for a found file candidate.
   *
   * Examples:
   *  - workspace root: /repo/plugin-example
   *  - candidate: /repo/plugin-example/cpy/test-nested-included/nested-not-here.pli
   *  -> returns "cpy/test-nested-included"
   *
   * If workspace-relative cannot be computed, returns the parent folder name (e.g. "test-nested-included").
   * Returns undefined if candidate looks invalid.
   */
  export function computeWorkspaceRelativeParentFolder(
    candidateRaw: URI,
    workspaceFolderUri: URI,
  ): string | undefined {
    if (!candidateRaw) return undefined;

    const candidate = normalize(candidateRaw);
    const workspaceFolder = normalize(workspaceFolderUri);

    if (!candidate.startsWith(workspaceFolder)) return undefined;

    const relativePath = candidate.slice(workspaceFolder.length);
    const parentDir = relativePath.substring(0, relativePath.lastIndexOf("/"));
    const parentRelativePath = parentDir.startsWith("/")
      ? parentDir.slice(1)
      : parentDir;

    return parentRelativePath;
  }
}
