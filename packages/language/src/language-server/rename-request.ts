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
import {
  findTokenElementReference,
  getReferenceLocations,
  getTokenAt,
} from "../linking/resolver";
import { getNameToken } from "../linking/tokens";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";
import { BuiltinsUriSchema } from "../workspace/builtins-constants";

export type RenameResult =
  | { kind: "edits"; changes: Record<DocumentUri, Location[]> }
  /** The symbol's declaration only exists in preprocessor-generated text - renaming it is impossible. */
  | { kind: "generated"; name: string }
  /** The symbol is a built-in and cannot be renamed. */
  | { kind: "builtin"; name: string };

export function renameRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): RenameResult {
  // A symbol whose declaration only exists in preprocessor-generated text (e.g. the CICS
  // `DFH*` declarations) cannot be renamed: the declaration is regenerated on every run,
  // so the rename can never take effect - refuse instead of silently renaming only the
  // real-source usages.
  const token = getTokenAt(unit, uri, offset);
  if (token) {
    const element = findTokenElementReference(token);
    const nameToken = element && getNameToken(element);
    if (nameToken?.synthetic) {
      return { kind: "generated", name: nameToken.image };
    } else if (nameToken?.uri?.scheme === BuiltinsUriSchema) {
      return { kind: "builtin", name: nameToken.image };
    }
  }

  // Locations of `synthetic` usage tokens are already suppressed by
  // `getReferenceLocations`, so the edit set only touches real source text.
  const references = getReferenceLocations(unit, uri, offset);
  const referencesGroupedByUri = groupBy(
    references,
    (reference) => reference.uri,
  );

  return { kind: "edits", changes: referencesGroupedByUri };
}
