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

import { DocumentUri } from "vscode-languageserver-types";
import { Location } from "./types";
import { groupBy } from "../utils/common";
import { getReferenceLocations } from "../linking/resolver";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";

export function renameRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): Record<DocumentUri, Location[]> {
  const references = getReferenceLocations(unit, uri, offset);
  const referencesGroupedByUri = groupBy(
    references,
    (reference) => reference.uri,
  );

  return referencesGroupedByUri;
}
