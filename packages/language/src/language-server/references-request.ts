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

import { getReferenceLocations } from "../linking/resolver";
import { Location } from "./types";
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";

export function referencesRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): Location[] {
  return getReferenceLocations(unit, uri, offset);
}
