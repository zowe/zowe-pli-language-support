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

export type WorkspaceFolderNode<TData> = {
  uri: string;
  part: string;
  parent: WorkspaceFolderNode<TData> | null;
  children: Record<string, WorkspaceFolderNode<TData>>;
  data?: TData;
};

export class WorkspaceFolderTree<TData> {
  private root: WorkspaceFolderNode<TData> = {
    uri: "",
    part: "",
    parent: null,
    children: {},
    data: undefined,
  };
  private dataByUri: Map<string, TData> = new Map();

  constructor(private readonly caseInsensitive: boolean = false) {}

  public getAllWorkspaceFolders(): TData[] {
    return Array.from(this.dataByUri.values());
  }

  public addWorkspaceFolder(folderUri: string | URI, folder: TData): void {
    const parts = this.prepareUriParts(folderUri);
    let currentChildren = this.root.children;
    let parent: WorkspaceFolderNode<TData> = this.root;
    const currentPath = [];
    for (const part of parts) {
      currentPath.push(part);
      if (currentChildren[part] === undefined) {
        currentChildren[part] = {
          uri: currentPath.join("/"),
          part,
          parent,
          children: {},
        };
      }
      parent = currentChildren[part];
      currentChildren = parent.children;
    }
    parent.data = folder;
    this.dataByUri.set(folderUri.toString(), folder);
  }

  /**
   * Removes the folder registered at exactly `folderUri`.
   * Nested folders registered below it are kept.
   * @returns the removed data, or `undefined` if no folder was registered there
   */
  public removeWorkspaceFolder(folderUri: string | URI): TData | undefined {
    let node: WorkspaceFolderNode<TData> = this.root;
    for (const part of this.prepareUriParts(folderUri)) {
      const child = node.children[part];
      if (child === undefined) {
        return undefined;
      }
      node = child;
    }
    const data = node.data;
    node.data = undefined;
    this.dataByUri.delete(folderUri.toString());
    // Prune now-empty path nodes so they don't linger forever.
    while (
      node.parent &&
      node.data === undefined &&
      Object.keys(node.children).length === 0
    ) {
      delete node.parent.children[node.part];
      node = node.parent;
    }
    return data;
  }

  private prepareUriParts(uri: string | URI) {
    const normalized = UriUtils.normalizePath(
      typeof uri === "string" ? uri : uri.toString(),
    );
    return UriUtils.parts(normalized).map((part) =>
      this.caseInsensitive ? part.toLowerCase() : part,
    );
  }

  public getWorkspaceFolderOf(uri: string | URI): TData | undefined {
    const parts = this.prepareUriParts(uri);
    let currentChildren = this.root.children;
    let parent: WorkspaceFolderNode<TData> = this.root;
    let currentData: TData | undefined = parent.data;
    for (const part of parts) {
      if (currentChildren[part] === undefined) {
        break;
      }
      parent = currentChildren[part];
      currentChildren = parent.children;
      if (parent.data !== undefined) {
        currentData = parent.data;
      }
    }
    return currentData;
  }
}
