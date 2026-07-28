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
import { BuiltinsUriSchema } from "../workspace/builtins-constants";
export { URI };

/** Matches Windows absolute paths: letter + colon + slash, e.g. C:\ or D:/ */
const WINDOWS_DRIVE_REGEX = /^[a-zA-Z]:[\\\/]/;
/** Matches URI scheme prefixes, e.g. file:, memory:, https: */
const SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
/** Schemes where '#' is always a literal path character, never a fragment delimiter */
const FRAGMENTLESS_SCHEME_REGEX = /^(?:file|memory|git|untitled|pli-builtin):/i;

export namespace UriUtils {
  export const basename = Utils.basename;
  export const dirname = Utils.dirname;
  export const extname = Utils.extname;
  export const joinPath = Utils.joinPath;
  export const resolvePath = Utils.resolvePath;

  export const isWindowsAbsolutePath = (path: string) =>
    path.charAt(1) === ":" &&
    (path.charAt(2) === "/" || path.charAt(2) === "\\") &&
    /^[a-zA-Z]/.test(path.charAt(0));
  export const isUnixAbsolutePath = (path: string) => path.startsWith("/");
  export const isHomePath = (path: string) =>
    path.charAt(0) === "~" &&
    (path.charAt(1) === "/" || path.charAt(1) === "\\" || path.length === 1);

  export enum PathType {
    Absolute,
    Relative,
    URI,
  }

  export function computePathType(path: string): PathType {
    if (
      isWindowsAbsolutePath(path) ||
      isUnixAbsolutePath(path) ||
      isHomePath(path)
    ) {
      return PathType.Absolute;
    }
    if (SCHEME_REGEX.test(path)) {
      return PathType.URI;
    }
    return PathType.Relative;
  }

  /**
   * Smart constructor: detects whether input is a URI string or a file path
   * and calls the correct vscode-uri factory.
   *
   * - URI objects pass through (with a defensive fragment-to-path merge)
   * - Strings starting with a Windows drive letter (e.g. C:\) go through URI.file
   * - Strings with a URI scheme (file://, memory://) go through URI.parse
   * - All other strings (bare paths) go through URI.file, which correctly
   *   encodes special characters like '#' and spaces
   *
   * For file-like schemes (file://, memory://), any '#' in the URI string
   * is escaped to '%23' before parsing, because these schemes never use
   * URI fragments — '#' is always a literal path character (common in
   * PL/I filenames like A1@#_$).
   */
  export function toUri(input: string | URI): URI {
    if (typeof input !== "string") {
      return input.fragment
        ? input.with({
            path: input.path + "#" + input.fragment,
            fragment: "",
          })
        : input;
    }
    if (WINDOWS_DRIVE_REGEX.test(input)) {
      return file(input);
    }
    if (SCHEME_REGEX.test(input)) {
      return parse(input);
    }
    return URI.file(input);
  }

  export function normalizePath(path: string): string {
    return path.replace(/\\/g, "/");
  }

  export function parse(uri: string): URI {
    const safeInput = FRAGMENTLESS_SCHEME_REGEX.test(uri)
      ? uri.replace(/#/g, "%23")
      : uri;
    return URI.parse(safeInput);
  }

  export function file(path: string): URI {
    return URI.file(normalizePath(path));
  }

  export function equals(a?: URI | string, b?: URI | string): boolean {
    if (a === undefined || b === undefined) {
      return a === b;
    }
    const lhs = typeof a === "string" ? UriUtils.toUri(a) : a;
    const rhs = typeof b === "string" ? UriUtils.toUri(b) : b;
    return toNormalizedKey(lhs) === toNormalizedKey(rhs);
  }

  /**
   * Produces a canonical, case-insensitive string key for map lookups and
   * equality comparisons. Built from decoded path components to avoid
   * encoding variance.
   */
  export function toNormalizedKey(
    input: URI | string,
    lowerCase = true,
  ): string {
    const uri = typeof input === "string" ? toUri(input) : input;
    const convert = lowerCase
      ? (s: string) => s.toLowerCase()
      : (s: string) => s;
    const path = convert(normalizePath(uri.path));
    const scheme = uri.scheme ? convert(uri.scheme) + "://" : "";
    const authority = uri.authority ? convert(uri.authority) : "";
    return `${scheme}${authority}${path}`;
  }

  /**
   * Returns a normalized, decoded file path string with no scheme.
   * - Backslashes are normalized to forward slashes
   * - Windows drive letters are uppercased and the URI leading slash is
   *   stripped (e.g. /c:/path -> C:/path)
   */
  export function toFilePath(input: URI | string): string {
    const uri = typeof input === "string" ? toUri(input) : input;
    let path = normalizePath(uri.path);
    if (/^\/[a-zA-Z]:\//.test(path)) {
      path = path[1].toUpperCase() + path.slice(2);
    } else if (/^[a-zA-Z]:\//.test(path)) {
      path = path[0].toUpperCase() + path.slice(1);
    }
    return path;
  }

  export function isPathRelative(path: string) {
    if (path.startsWith("../") || path.startsWith("./")) {
      return true;
    }
    const startsWithLetter = /^[a-zA-Z]/.test(path.charAt(0));
    const isAbsolute = isWindowsAbsolutePath(path) || isUnixAbsolutePath(path);
    return startsWithLetter && !isAbsolute;
  }

  /**
   * Strips a Windows drive letter prefix (e.g. "C:") from a path, returning
   * the path portion and the extracted drive letter separately.
   */
  function splitDrive(path: string): { path: string; drive: string | null } {
    if (/^[a-zA-Z]:\//.test(path)) {
      return { path: path.slice(2), drive: path.slice(0, 2) };
    }
    return { path, drive: null };
  }

  export function parts(path: string): string[] {
    return path.split("/").filter((e) => e.length > 0);
  }

  export function contains(parent: URI | string, child: URI | string): boolean {
    const parentKey = toNormalizedKey(parent);
    const childKey = toNormalizedKey(child);
    return (
      childKey === parentKey ||
      (childKey.startsWith(parentKey) &&
        (childKey[parentKey.length] === "/" || parentKey.endsWith("/")))
    );
  }

  export function relative(from: URI | string, to: URI | string): string {
    const fromFull = toFilePath(from);
    const toFull = toFilePath(to);

    const { path: fromPath, drive: fromDriveLetter } = splitDrive(fromFull);
    const { path: toPath, drive: toDriveLetter } = splitDrive(toFull);

    if (fromDriveLetter !== toDriveLetter) {
      return toPath;
    }
    const fromParts = parts(fromPath);
    const toParts = parts(toPath);
    let commonFolders = 0;
    for (; commonFolders < fromParts.length; commonFolders++) {
      if (fromParts[commonFolders] !== toParts[commonFolders]) {
        break;
      }
    }
    if (fromParts.length - commonFolders > 1) {
      return toPath;
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
   * Computes a relative path from one location to another.
   * Ensures the result is prefixed with `./` for relative paths or returns
   * an absolute fallback when paths cannot be related (e.g., different drives on Windows).
   */
  export function composeRelativePath(
    from: string,
    to: string,
    fallback = to,
  ): string {
    const rel = UriUtils.relative(from, to);
    if (UriUtils.isPathRelative(rel)) {
      return "./" + rel;
    }
    return toFilePath(fallback);
  }

  /**
   * Normalizes a URI or path string into a canonical URI string representation.
   * Useful for producing consistent keys in document maps.
   */
  export function normalize(uri: URI | string): string {
    return toUri(uri).toString();
  }

  /**
   * Returns `entry` relative to `workspace` (original casing preserved), or its
   * absolute path when outside the workspace. Membership is matched
   * case-insensitively for correctness on case-insensitive file systems.
   */
  export function workspaceRelativeEntryPath(
    workspace: URI | string,
    entry: URI | string,
  ): string {
    const entryPath = toFilePath(entry);
    const workspaceParts = parts(toFilePath(workspace));
    const entryParts = parts(entryPath);
    const isInsideWorkspace = workspaceParts.every(
      (part, index) => part.toLowerCase() === entryParts[index]?.toLowerCase(),
    );
    return isInsideWorkspace
      ? entryParts.slice(workspaceParts.length).join("/")
      : entryPath;
  }

  /**
   * Returns the candidate's workspace-relative parent folder (original casing
   * preserved), `""` when it sits in the workspace root, or `undefined` when it
   * is outside the workspace or invalid.
   */
  export function computeWorkspaceRelativeParentFolder(
    candidateRaw: URI,
    workspaceFolderUri: URI,
  ): string | undefined {
    if (!candidateRaw) return undefined;

    const relativePath = workspaceRelativeEntryPath(
      workspaceFolderUri,
      candidateRaw,
    );

    // Outside the workspace the relative computation falls back to an absolute
    // path; there's no meaningful workspace-relative lib folder to suggest.
    if (computePathType(relativePath) !== PathType.Relative) {
      return undefined;
    }

    const lastSlash = relativePath.lastIndexOf("/");
    return lastSlash === -1 ? "" : relativePath.slice(0, lastSlash);
  }
}

const virtualSchemes = ["git", "untitled", BuiltinsUriSchema];

export function isVirtualFile(uri: string): boolean {
  return virtualSchemes.some((scheme) => uri.startsWith(`${scheme}:`));
}
