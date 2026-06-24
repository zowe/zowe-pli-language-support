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
 */
export function resolveLibUri(
  lib: string,
  workspace: URI,
  scheme?: string,
): URI {
  lib = lib.replace(/\\/g, "/");
  const pathType = UriUtils.computePathType(lib);
  if (pathType === UriUtils.PathType.URI) {
    return UriUtils.parse(lib);
  }
  if (pathType === UriUtils.PathType.Absolute) {
    return UriUtils.file(lib).with({ scheme: scheme ?? workspace.scheme });
  }
  return UriUtils.joinPath(workspace, lib);
}

/**
 * Like {@link resolveLibUri} but joins a file name to the resolved lib
 * URI. Convenient for include resolution where the lib path identifies a
 * directory and the include name identifies a file within it.
 */
export function resolveLibFileUri(
  lib: string,
  fileName: string | undefined,
  workspace: URI,
  scheme?: string,
): URI | undefined {
  const base = resolveLibUri(lib, workspace, scheme);
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
