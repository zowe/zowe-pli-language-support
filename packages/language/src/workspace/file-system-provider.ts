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
}

export interface FileSystemProvider {
  readFile(uri: URI): Promise<string | undefined>;
  fileExists(uri: URI): Promise<boolean>;
  writeFile(uri: URI, value: string): Promise<void>;
  deleteFile(uri: URI): Promise<void>;
  /**
   * Performs a file search. Implementation depends on the provider.
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

  async search(pattern: SearchOptions): Promise<URI | undefined> {
    const uri = pattern.path.toString().toLowerCase();
    if (this.files.has(uri)) {
      return pattern.path;
    }
    const extensions = pattern.extensions ?? [];
    for (const ext of extensions) {
      const fullPath = uri + (ext.startsWith(".") ? ext : `.${ext}`);
      if (this.files.has(fullPath)) {
        return URI.parse(fullPath).with({ scheme: pattern.path.scheme });
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
