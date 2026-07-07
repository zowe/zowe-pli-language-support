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

import { URI, UriUtils } from "../utils/uri";

/**
 * File or directory stats
 */
export interface Stats {
  isFile: boolean;
  isDirectory: boolean;
}

export const enum FileType {
  Unknown = 0,
  File = 1,
  Directory = 2,
  SymbolicLink = 64,
}

export interface FileSystemProvider {
  readFile(uri: URI): Promise<string | undefined>;
  /**
   * Reads the contents of a directory.
   * The result is an array of [name, FileType] tuples.
   */
  readDir(uri: URI): Promise<[string, FileType][]>;
  fileExists(uri: URI): Promise<boolean>;
  writeFile(uri: URI, value: string): Promise<void>;
  deleteFile(uri: URI): Promise<void>;

  /**
   * Locates a file anywhere in the workspace whose path ends with the given
   * `path` (optionally followed by one of the supplied extensions). Returns
   * the URI of the first match, or undefined.
   *
   * Used by code actions like "add this file's parent dir to libs" — i.e.
   * the user has an unresolved include and we want to discover the file's
   * location regardless of the configured lib paths. Lib-aware include
   * resolution does NOT use this; it consults the per-lib indexes built at
   * configuration-load time.
   */
  findFile(path: URI, extensions: readonly string[]): Promise<URI | undefined>;

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

  readDir(_uri: URI): Promise<[string, FileType][]> {
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

  findFile(
    _path: URI,
    _extensions: readonly string[],
  ): Promise<URI | undefined> {
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
   * Sorted list of files, ordered by depth 1st & alphabetically 2nd
   * Used to ensure search returns the shallowest match regardless of insertion order
   * Ex. /a/b/c/file.pli vs. /a/file.pli, where the latter should match first
   * Lazily computed & set via `getSortedFiles`
   */
  private sortedFilesCache: string[] | undefined;

  private caseSensitive: boolean;

  constructor(caseSensitive = false) {
    this.caseSensitive = caseSensitive;
  }

  /**
   * Write a file to the virtualized file system
   * Clears the sorted files cache
   */
  async writeFile(uri: URI, value: string): Promise<void> {
    this.files.set(UriUtils.toNormalizedKey(uri, !this.caseSensitive), value);
    this.sortedFilesCache = undefined;
  }

  /**
   * Attempts to read a file synchronously from the virtualized file system.
   * If the file does not exist, undefined is returned.
   */
  async readFile(uri: URI): Promise<string | undefined> {
    return this.files.get(UriUtils.toNormalizedKey(uri, !this.caseSensitive));
  }

  /**
   * Reads the contents of a directory in the virtualized file system.
   * The result is an array of file & directory names as strings.
   * Directories are virtual in this case, only existing if there are files with matching prefixes.
   * If no matching directory entry is found (i.e. no entries), an exception is thrown
   * If the file system is empty, an empty array is returned (assuming uninitialized)
   */
  async readDir(uri: URI): Promise<[string, FileType][]> {
    // collect all entries which start with the given path
    let path = UriUtils.toNormalizedKey(uri, !this.caseSensitive);
    if (!path.endsWith("/")) {
      path += "/";
    }
    const entries = new Map<string, FileType>();
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        const relativePath = filePath.substring(path.length);
        const parts = UriUtils.parts(relativePath);
        if (parts.length > 0) {
          const name = parts[0];
          const type = parts.length === 1 ? FileType.File : FileType.Directory;
          // Directory wins if an entry appears as both (e.g. /foo file and /foo/bar file)
          if (!entries.has(name) || type === FileType.Directory) {
            entries.set(name, type);
          }
        }
      }
    }
    if (entries.size === 0) {
      // when no files are found, we assume the directory does not exist
      // as we don't currently support creating empty dirs in the vfs
      throw new Error(`Directory not found: ${uri.toString(true)}`);
    }
    return Array.from(entries);
  }

  /**
   * Checks if a file exists in the virtualized file system
   */
  async fileExists(uri: URI): Promise<boolean> {
    return this.files.has(UriUtils.toNormalizedKey(uri, !this.caseSensitive));
  }

  /**
   * Deletes a file from the virtualized file system
   * Drops the associated sorted files cache entry as well
   */
  async deleteFile(uri: URI): Promise<void> {
    const key = UriUtils.toNormalizedKey(uri, !this.caseSensitive);
    this.files.delete(key);
    const cacheIndex = this.sortedFilesCache?.indexOf(key);
    if (cacheIndex !== undefined && cacheIndex >= 0) {
      this.sortedFilesCache?.splice(cacheIndex, 1);
    }
  }

  /**
   * Helper to get/compute sorted virtual files by depth 1st & alphabetically 2nd.
   * Generates sorted list on request, if not already available.
   */
  private getSortedFiles(): string[] {
    if (!this.sortedFilesCache) {
      this.sortedFilesCache = Array.from(this.files.keys()).sort((a, b) => {
        const aSlashes = (a.match(/\//g) || []).length;
        const bSlashes = (b.match(/\//g) || []).length;
        if (aSlashes === bSlashes) {
          return a.localeCompare(b);
        }
        return aSlashes - bSlashes;
      });
    }
    return this.sortedFilesCache;
  }

  /**
   * Workspace-wide file lookup: returns the first virtual file whose path
   * ends with the given URI's path, optionally followed by one of the
   * supplied extensions. Used for code actions that suggest configuring a
   * lib path for a file the resolver couldn't find.
   */
  async findFile(
    uri: URI,
    extensions: readonly string[],
  ): Promise<URI | undefined> {
    let targetPath = UriUtils.normalizePath(uri.path);
    if (!this.caseSensitive) {
      targetPath = targetPath.toLowerCase();
    }
    const sortedFiles = this.getSortedFiles();
    for (const filePath of sortedFiles) {
      if (filePath.endsWith(targetPath)) {
        return UriUtils.toUri(filePath).with({ scheme: uri.scheme });
      }
      for (const ext of extensions) {
        const fullPath = targetPath + (ext.startsWith(".") ? ext : `.${ext}`);
        if (filePath.endsWith(fullPath)) {
          return UriUtils.toUri(filePath).with({ scheme: uri.scheme });
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
    const key = UriUtils.toNormalizedKey(uri, !this.caseSensitive);
    const isFile = this.files.has(key);
    let isDirectory = false;
    if (!isFile) {
      const dirKey = key.endsWith("/") ? key : key + "/";
      for (const filePath of this.files.keys()) {
        if (filePath.startsWith(dirKey)) {
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
