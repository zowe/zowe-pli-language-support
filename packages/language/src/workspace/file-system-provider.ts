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

export interface SearchOptions {
  path: URI;
  extensions: string[];
  global?: boolean;
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
    this.files.set(uri.toString().toLowerCase(), value);
  }

  /**
   * Attempts to read a file synchronously from the virtualized file system.
   * If the file does not exist, undefined is returned.
   */
  async readFile(uri: URI): Promise<string | undefined> {
    return this.files.get(uri.toString().toLowerCase());
  }

  /**
   * Reads the contents of a directory in the virtualized file system.
   * The result is an array of directory entries w/ types.
   * Directories are virtual in this case, only existing if there are files with matching prefixes.
   * If no entries are found, an empty array is returned.
   */
  async readDir(uri: URI): Promise<DirEntry[]> {
    // collect all entries which start with the given path
    const path = uri.toString().toLowerCase();
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
    return entries;
  }

  /**
   * Checks if a file exists in the virtualized file system
   */
  async fileExists(uri: URI): Promise<boolean> {
    return this.files.has(uri.toString().toLowerCase());
  }

  /**
   * Deletes a file from the virtualized file system
   */
  async deleteFile(uri: URI): Promise<void> {
    this.files.delete(uri.toString().toLowerCase());
  }

  /**
   * Performs a simple search in the virtualized file system.
   * Checks if the exact path exists, otherwise tries with each of the given extensions.
   * @param options Options to configure the search
   * @returns First match, or undefined if no match found
   */
  async search(options: SearchOptions): Promise<URI | undefined> {
    const searchPath = options.path
      .toString()
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
          const fullPath = searchPath + (ext.startsWith(".") ? ext : `.${ext}`);
          if (filePath.endsWith(fullPath)) {
            return URI.parse(filePath).with({ scheme: options.path.scheme });
          }
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
