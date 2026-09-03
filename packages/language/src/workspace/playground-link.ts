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

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

/**
 * A single file within a {@link SharedWorkspace}. `uri` is a virtual,
 * absolute path (e.g. `/workspace/hello-world.pli`) as understood by the
 * playground's in-memory file system, not a real file system path.
 */
export interface WorkspaceFile {
  uri: string;
  content: string;
}

/**
 * The payload encoded into a playground share link's `workspace` query
 * parameter.
 */
export interface SharedWorkspace {
  /**
   * The virtual URI (see {@link WorkspaceFile.uri}) of the file that should
   * be focused when the playground opens the link. Required: a workspace
   * without a focused file is treated as absent and falls back to the
   * playground's default workspace.
   */
  focused?: string;
  files: WorkspaceFile[];
}

/**
 * Encode a {@link SharedWorkspace} into a string suitable for use as a URL
 * query parameter value.
 */
export function encodePlaygroundWorkspace(workspace: SharedWorkspace): string {
  return compressToEncodedURIComponent(JSON.stringify(workspace));
}

/**
 * Decode a string produced by {@link encodePlaygroundWorkspace}, returning
 * `undefined` if the input is not a validly encoded {@link SharedWorkspace}.
 */
export function decodePlaygroundWorkspace(
  encoded: string,
): SharedWorkspace | undefined {
  try {
    const workspace = JSON.parse(decompressFromEncodedURIComponent(encoded));
    if (
      workspace &&
      typeof workspace === "object" &&
      "files" in workspace &&
      Array.isArray(workspace.files)
    ) {
      return workspace as SharedWorkspace;
    }
  } catch {
    // fall through, return undefined
  }
  return undefined;
}

/**
 * Decode a string produced by the playground's single-file "Share Current"
 * link (the `content` query parameter), which is the raw file text
 * compressed directly, without the JSON envelope {@link SharedWorkspace}
 * uses.
 */
export function decodePlaygroundContent(encoded: string): string {
  return decompressFromEncodedURIComponent(encoded);
}

/**
 * Sanitize a user-supplied `filename` query parameter (from a single-file
 * share link) into a bare file name: strips path separators and leading
 * dots so it can't escape the directory it's written into, falling back to
 * `example.pli` when absent.
 */
export function sanitizeSharedFilename(
  filename: string | null | undefined,
): string {
  return filename?.replace(/[\\/]/g, "").replace(/^\.+/g, "") || "example.pli";
}
