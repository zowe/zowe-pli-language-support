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

import { URI } from "../utils/uri";

export type SearchOptions =
  | PathSearch
  | MemberSearchInDir
  | MemberSearchWithDDPath;

/**
 * Search by full path with optional extensions.
 * Global option indicates whether to perform a global lookup or not
 */
interface PathSearch {
  path: URI;
  extensions: string[];
  global?: boolean;
}

/**
 * Search by member name in given directory
 * We don't know the ddname up front, but we know the member.
 * So we'll need to perform a search in the given directory for any file matching the member
 * Ex. a/b/c ... m1, where we search for any file in a/b/c that ends with (m1)
 */
interface MemberSearchInDir {
  /**
   * Path to candidate directory, which may contain this member under a ddname
   */
  dirPath: URI;

  /**
   * Member we're looking for
   */
  member: string;
}

/**
 * Search by member name w/ a path up to & including the ddname.
 * Combined with the member, we can construct a complete path to search.
 * The search implementation determines how best to combine the two.
 */
interface MemberSearchWithDDPath {
  /**
   * Partial path that corresponds to a common ddname
   * Ex. entries like A.B.C(m1) & A.B.C(m2) would result in ddPath 'A.B.C'
   */
  ddPath: string;

  /**
   * Member we're looking for
   */
  member: string;
}

export function isPathSearch(obj: any): obj is PathSearch {
  return (
    obj &&
    typeof obj === "object" &&
    "path" in obj &&
    "extensions" in obj &&
    Array.isArray(obj.extensions)
  );
}

export function isMemberSearchInDir(obj: any): obj is MemberSearchInDir {
  return (
    obj &&
    typeof obj === "object" &&
    "dirPath" in obj &&
    "member" in obj &&
    typeof obj.member === "string"
  );
}

export function isMemberSearchWithDDPath(
  obj: any,
): obj is MemberSearchWithDDPath {
  return (
    obj &&
    typeof obj === "object" &&
    "ddPath" in obj &&
    "member" in obj &&
    typeof obj.member === "string"
  );
}

/**
 * Directory entry types, used in readDir results
 */
export enum DirEntryType {
  File = 1,
  Directory = 2,
}

/**
 * Directory entry, used in readDir results
 */
export interface DirEntry {
  name: string;
  type: DirEntryType;
}

export interface FileSystemProvider {
  readFile(uri: URI): Promise<string | undefined>;
  /**
   * Reads the contents of a directory. The result is an array of directory entries w/ types
   */
  readDir(uri: URI): Promise<DirEntry[]>;
  fileExists(uri: URI): Promise<boolean>;
  writeFile(uri: URI, value: string): Promise<void>;
  deleteFile(uri: URI): Promise<void>;
  /**
   * Performs a file search. Implementation depends on the provider.
   * Returns a singular URI if found, otherwise undefined.
   */
  search(options: SearchOptions): Promise<URI | undefined>;
}

/**
 * Empty file system, the default file system provider, which just returns empty strings for all URIs
 */
class _EmptyFileSystemProvider implements FileSystemProvider {
  readFile(_uri: URI): Promise<string | undefined> {
    return Promise.resolve("");
  }

  readDir(_uri: URI): Promise<DirEntry[]> {
    return Promise.resolve([]);
  }

  fileExists(_uri: URI): Promise<boolean> {
    return Promise.resolve(false);
  }

  writeFile(_uri: URI, _value: string): Promise<void> {
    return Promise.resolve();
  }

  deleteFile(_uri: URI): Promise<void> {
    return Promise.resolve();
  }

  search(_options: SearchOptions): Promise<URI | undefined> {
    return Promise.resolve(undefined);
  }
}

/**
 * Fixed empty file system provider instance
 */
export const EmptyFileSystemProvider = new _EmptyFileSystemProvider();

/**
 * Virtualized file system, internally represented as a flat map of files
 */
export class VirtualFileSystemProvider implements FileSystemProvider {
  /**
   * A flat map of files in the virtualized file system, all files are accessible whether in a directory or not this way
   */
  private readonly files: Map<string, string> = new Map<string, string>();

  /**
   * Write a file to the virtualized file system
   */
  async writeFile(uri: URI, value: string): Promise<void> {
    this.files.set(uri.toString(true).toLowerCase(), value);
  }

  /**
   * Attempts to read a file synchronously from the virtualized file system.
   * If the file does not exist, undefined is returned.
   */
  async readFile(uri: URI): Promise<string | undefined> {
    return this.files.get(uri.toString(true).toLowerCase());
  }

  /**
   * Reads the contents of a directory in the virtualized file system.
   * The result is an array of directory entries w/ types.
   * Directories are virtual in this case, only existing if there are files with matching prefixes.
   * If no matching directory entry is found (i.e. no entries), an exception is thrown
   * If the file system is empty, an empty array is returned (assuming uninitialized)
   */
  async readDir(uri: URI): Promise<DirEntry[]> {
    if (this.files.size === 0) {
      // not populated yet
      return [];
    }
    // collect all entries which start with the given path
    let path = uri.toString(true).toLowerCase();
    if (!path.endsWith("/")) {
      path += "/";
    }
    const entries: DirEntry[] = [];
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        const relativePath = filePath.substring(path.length);
        const parts = relativePath.split("/").filter((p) => p.length > 0);
        if (parts.length === 1) {
          // file
          entries.push({
            name: parts[0],
            type: DirEntryType.File,
          });
        } else {
          // directory
          entries.push({
            name: parts[0],
            type: DirEntryType.Directory,
          });
        }
      }
    }
    if (entries.length === 0) {
      // when no files are found, we assume the directory does not exist
      // as we don't currently support creating empty dirs in the vfs
      throw new Error(`Directory not found: ${uri.toString(true)}`);
    }
    return entries;
  }

  /**
   * Checks if a file exists in the virtualized file system
   */
  async fileExists(uri: URI): Promise<boolean> {
    return this.files.has(uri.toString(true).toLowerCase());
  }

  /**
   * Deletes a file from the virtualized file system
   */
  async deleteFile(uri: URI): Promise<void> {
    this.files.delete(uri.toString(true).toLowerCase());
  }

  /**
   * Performs a simple search in the virtualized file system.
   * Checks if the exact path exists, otherwise tries with each of the given extensions.
   * @param options Options to configure the search
   * @returns First match, or undefined if no match found
   */
  async search(options: SearchOptions): Promise<URI | undefined> {
    if (isPathSearch(options)) {
      // perform a search with a uri
      const searchPath = options.path
        .toString(true)
        .toLowerCase()
        .replace(/\\/g, "/");
      const extensions = options.extensions ?? [];

      if (!options.global) {
        if (this.files.has(searchPath)) {
          return options.path;
        }
        for (const ext of extensions) {
          const fullPath = searchPath + (ext.startsWith(".") ? ext : `.${ext}`);
          if (this.files.has(fullPath)) {
            return URI.parse(fullPath).with({ scheme: options.path.scheme });
          }
        }
      } else {
        // @wagner-laranjeiras. TODO: Optimize this matching pattern.
        for (const [filePath] of this.files) {
          if (filePath.endsWith(searchPath)) {
            return URI.parse(filePath);
          }
          for (const ext of extensions) {
            const fullPath =
              searchPath + (ext.startsWith(".") ? ext : `.${ext}`);
            if (filePath.endsWith(fullPath)) {
              return URI.parse(filePath).with({ scheme: options.path.scheme });
            }
          }
        }
      }
    } else if (isMemberSearchInDir(options)) {
      // perform a search by a member w/ candidate dir path
      const memberPart = `(${options.member})`.toLowerCase();
      for (const [filePath] of this.files) {
        const fpl = filePath.toLowerCase();
        if (
          fpl.endsWith(memberPart) &&
          fpl.startsWith(options.dirPath.toString(true).toLowerCase())
        ) {
          return URI.parse(filePath);
        }
      }
    } else {
      // member search w/ full path
      const memberPart = `(${options.member})`.toLowerCase();
      const searchPath = options.ddPath.toLowerCase() + memberPart;
      for (const [filePath] of this.files) {
        if (filePath.toLowerCase() === searchPath) {
          return URI.parse(filePath);
        }
      }
    }

    return undefined;
  }
}

/**
 * Global file system provider instance. Defaults to an empty file system provider.
 */
export let FileSystemProviderInstance: FileSystemProvider =
  EmptyFileSystemProvider;

/**
 * Sets the global file system provider
 */
export function setFileSystemProvider(
  provider: FileSystemProvider | undefined,
): void {
  FileSystemProviderInstance = provider ?? EmptyFileSystemProvider;
}
