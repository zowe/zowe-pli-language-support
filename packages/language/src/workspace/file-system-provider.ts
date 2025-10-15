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

export type SearchOptions = PathSearch | MemberSearchInDir;

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

export function isPathSearch(obj: any): obj is PathSearch {
  return (
    obj &&
    typeof obj === "object" &&
    "path" in obj &&
    "extensions" in obj &&
    Array.isArray(obj.extensions)
  );
}

/**
 * File or directory stats
 */
export interface Stats {
  isFile: boolean;
  isDirectory: boolean;
}

export interface FileSystemProvider {
  readFile(uri: URI): Promise<string | undefined>;
  /**
   * Reads the contents of a directory.
   * The result is an array of file & directory names as strings
   */
  readDir(uri: URI): Promise<string[]>;
  fileExists(uri: URI): Promise<boolean>;
  writeFile(uri: URI, value: string): Promise<void>;
  deleteFile(uri: URI): Promise<void>;
  /**
   * Performs a file search. Implementation depends on the provider.
   * Returns a singular URI if found, otherwise undefined.
   */
  search(options: SearchOptions): Promise<URI | undefined>;

  /**
   * Retrieve file or directory stats.
   * @param uri Of file or directory to stat
   * @returns Stats object
   */
  stat(uri: URI): Promise<Stats>;
}

/**
 * Empty file system, the default file system provider, which just returns empty strings for all URIs
 */
class _EmptyFileSystemProvider implements FileSystemProvider {
  readFile(_uri: URI): Promise<string | undefined> {
    return Promise.resolve("");
  }

  readDir(_uri: URI): Promise<string[]> {
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

  stat(_uri: URI): Promise<Stats> {
    return Promise.resolve({
      isFile: false,
      isDirectory: false,
    });
  }
}

/**
 * Fixed empty file system provider instance
 */
export const EmptyFileSystemProvider = new _EmptyFileSystemProvider();

/**
 * Virtualized file system, internally represented as a flat map of files.
 * Files & Directories are represented in a case-insensitive manner in this implementation,
 * by opting to store all paths in lower-case form, and perform all lookups in lower-case as well.
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
   * The result is an array of file & directory names as strings.
   * Directories are virtual in this case, only existing if there are files with matching prefixes.
   * If no matching directory entry is found (i.e. no entries), an exception is thrown
   * If the file system is empty, an empty array is returned (assuming uninitialized)
   */
  async readDir(uri: URI): Promise<string[]> {
    if (this.files.size === 0) {
      // not populated yet
      return [];
    }
    // collect all entries which start with the given path
    let path = uri.toString(true).toLowerCase();
    if (!path.endsWith("/")) {
      path += "/";
    }
    const entries: string[] = [];
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        const relativePath = filePath.substring(path.length);
        const parts = relativePath.split("/").filter((p) => p.length > 0);
        if (parts.length > 0) {
          entries.push(parts[0]);
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
        .replace(/\\/g, "/")
        .replace("file:///", "");
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
    } else {
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
    }

    return undefined;
  }

  /**
   * Retrieve file or directory stats for the virtual file system.
   * Folders are virtual, so we check for any files that start with the given path + "/" to indicate
   * their presence
   * @param uri URI of file or directory to stat
   * @returns Stats object
   */
  async stat(uri: URI): Promise<Stats> {
    const path = uri.toString(true).toLowerCase();
    const isFile = this.files.has(path);
    let isDirectory = false;
    if (!isFile) {
      // check if any files start with this path + "/"
      const dirPath = path.endsWith("/") ? path : path + "/";
      for (const filePath of this.files.keys()) {
        if (filePath.startsWith(dirPath)) {
          isDirectory = true;
          break;
        }
      }
    }
    return {
      isFile,
      isDirectory,
    };
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
