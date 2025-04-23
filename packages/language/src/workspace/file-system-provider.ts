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

export interface FileSystemProvider {
  readFileSync(uri: URI): string | undefined;
}

/**
 * Empty file system, the default file system provider, which just returns empty strings for all URIs
 */
class _EmptyFileSystemProvider implements FileSystemProvider {
  readFileSync(_uri: URI): string {
    return "";
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
  writeFile(uri: URI, value: string): void {
    this.files.set(uri.path, value);
  }

  /**
   * Attempts to read a file synchronously from the virtualized file system.
   * If the file does not exist, undefined is returned.
   */
  readFileSync(uri: URI): string | undefined {
    return this.files.get(uri.path);
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
