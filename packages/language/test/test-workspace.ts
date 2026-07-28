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

import { Connection } from "vscode-languageserver";
import { resetDocumentProviders } from "../src/language-server/text-documents";
import {
  EmptyFileSystemProvider,
  FileSystemProvider,
  VirtualFileSystemProvider,
} from "../src/workspace/file-system-provider";
import { WorkspaceContext } from "../src/workspace/workspace-context";

let _defaultTestWorkspace: WorkspaceContext | undefined;

/**
 * Workspace context returned by the test parse helpers when no workspace is
 * threaded through explicitly. Production code never reaches for this —
 * `WorkspaceContext` is always passed in. For tests, having a single
 * mutable default keeps fixtures concise.
 *
 * Tests that need a custom FS call {@link setDefaultTestWorkspace} (or
 * pass their workspace into the helper directly) in `beforeEach`.
 */
export function defaultTestWorkspace(): WorkspaceContext {
  if (!_defaultTestWorkspace) {
    _defaultTestWorkspace = new WorkspaceContext(
      EmptyFileSystemProvider,
    );
  }
  return _defaultTestWorkspace;
}

/**
 * Replaces the workspace returned by {@link defaultTestWorkspace}. Pass
 * `undefined` to reset; tests calling this in `beforeEach` should reset
 * in `afterEach`.
 */
export function setDefaultTestWorkspace(
  workspace: WorkspaceContext | undefined,
): void {
  _defaultTestWorkspace = workspace;
}

/**
 * Builds a fresh {@link WorkspaceContext} backed by the given provider
 * (defaults to a new {@link VirtualFileSystemProvider}). Also wires the
 * URI-loading document store at module level to the same provider, since
 * include resolution leans on it. Returns the new workspace.
 */
export function createTestWorkspace(
  fs: FileSystemProvider = new VirtualFileSystemProvider(),
  connection?: Connection,
): WorkspaceContext {
  resetDocumentProviders(fs);
  return new WorkspaceContext(fs, connection);
}
