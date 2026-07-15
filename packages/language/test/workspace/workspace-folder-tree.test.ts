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

import { describe, expect, test } from "vitest";
import { WorkspaceFolderTree } from "../../src/workspace/workspace-folder-tree";

describe("Workspace Folder Tree", () => {
  test("file:// schema", async () => {
    const tree = new WorkspaceFolderTree<number>(false);
    tree.addWorkspaceFolder("file:///home/user/project", 1);
    tree.addWorkspaceFolder("file:///home/user/project/some/nested/folder", 2);
    expect(tree.getWorkspaceFolderOf("file:///home/user/project")).toBe(1);
    expect(tree.getWorkspaceFolderOf("file:///home/user/project/sub")).toBe(1);
    expect(tree.getWorkspaceFolderOf("file:///home/user/project/folder")).toBe(
      1,
    );
    expect(tree.getWorkspaceFolderOf("file:///home/user")).toBe(undefined);
    expect(
      tree.getWorkspaceFolderOf("file:///home/user/project/some/nested/folder"),
    ).toBe(2);
    expect(
      tree.getWorkspaceFolderOf(
        "file:///home/user/project/some/nested/folder/sub",
      ),
    ).toBe(2);
    expect(
      tree.getWorkspaceFolderOf(
        "file:///home/user/project/some/nested/folder/other",
      ),
    ).toBe(2);
    expect(
      tree.getWorkspaceFolderOf("file:///home/user/project/some/nested"),
    ).toBe(1);
  });
  test("windows schema", async () => {
    const tree = new WorkspaceFolderTree<number>(true);
    tree.addWorkspaceFolder("C:\\Users\\User\\Project", 1);
    expect(tree.getWorkspaceFolderOf("C:\\Users\\User\\Project")).toBe(1);
    expect(tree.getWorkspaceFolderOf("C:\\Users\\User\\Project\\Sub")).toBe(1);
    expect(tree.getWorkspaceFolderOf("C:\\Users\\User\\Project\\Folder")).toBe(
      1,
    );
    expect(tree.getWorkspaceFolderOf("c:\\users\\user\\project\\folder")).toBe(
      1,
    );
    expect(tree.getWorkspaceFolderOf("C:\\Users\\User")).toBe(undefined);
    expect(tree.getWorkspaceFolderOf("D:\\Users\\User\\Project")).toBe(
      undefined,
    );
  });
});
