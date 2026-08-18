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
 * Builds a URI from a lib string in any of the three accepted shapes:
 * a full URI (`file:///foo`), an absolute filesystem path (`/foo`,
 * `C:/foo`), or a workspace-relative path (`cpy`, `cpy/sub`).
 *
 * Used by both lib expansion (when populating computed libs) and include
 * resolution (when materializing per-include URIs from those libs). The
 * `scheme` parameter overrides the absolute-path scheme so include
 * resolution can match the entry file's scheme; lib expansion passes the
 * workspace scheme.
 *
 * A workspace-relative path cannot be resolved without a workspace
 * (`workspace === undefined`, i.e. the fallback workspace) and yields
 * `undefined`.
 */
export function resolveLibUri(
  lib: string,
  workspace: URI | undefined,
  scheme?: string,
): URI | undefined {
  lib = UriUtils.normalizePath(lib);
  const pathType = UriUtils.computePathType(lib);
  if (pathType === UriUtils.PathType.URI) {
    return UriUtils.parse(lib);
  }
  if (pathType === UriUtils.PathType.Absolute) {
    const fileUri = UriUtils.file(lib);
    const targetScheme = scheme ?? workspace?.scheme;
    return targetScheme ? fileUri.with({ scheme: targetScheme }) : fileUri;
  }
  return workspace ? UriUtils.joinPath(workspace, lib) : undefined;
}

/**
 * Like {@link resolveLibUri} but joins a file name to the resolved lib
 * URI. Convenient for include resolution where the lib path identifies a
 * directory and the include name identifies a file within it.
 */
export function resolveLibFileUri(
  lib: string,
  fileName: string | undefined,
  workspace: URI | undefined,
  scheme?: string,
): URI | undefined {
  const base = resolveLibUri(lib, workspace, scheme);
  if (!base) {
    return undefined;
  }
  if (fileName) {
    const joined = UriUtils.joinPath(base, fileName);
    if (!UriUtils.contains(base, joined)) {
      // The resolved path is outside of the lib.
      // Don't return it, because it allows to read outside of the defined library
      return undefined;
    }
    return joined;
  }
  return base;
}
