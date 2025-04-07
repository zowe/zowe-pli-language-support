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
  readFileSync(uri: URI): string;
}

class _EmptyFileSystemProvider implements FileSystemProvider {
  readFileSync(uri: URI): string {
    return "";
  }
}

export const EmptyFileSystemProvider = new _EmptyFileSystemProvider();

export class VirtualFileSystemProvider implements FileSystemProvider {
  private readonly files: Map<string, string> = new Map<string, string>();

  writeFile(uri: URI, value: string): void {
    this.files.set(uri.path, value);
  }

  readFileSync(uri: URI): string {
    return this.files.get(uri.path) || "";
  }
}

export let FileSystemProviderInstance: FileSystemProvider =
  EmptyFileSystemProvider;

export function setFileSystemProvider(
  provider: FileSystemProvider | undefined,
): void {
  FileSystemProviderInstance = provider ?? EmptyFileSystemProvider;
}
