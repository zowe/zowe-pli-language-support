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

import { SourceFile } from "../workspace/source-file";
import { referencesRequest } from "./references-request";
import { DocumentUri } from "vscode-languageserver-types";
import { Location } from "./types";
import { groupBy } from "../utils/common";

export function renameRequest(
  sourceFile: SourceFile,
  offset: number,
): Record<DocumentUri, Location[]> {
  const references = referencesRequest(sourceFile, offset);
  const referencesGroupedByUri = groupBy(
    references,
    (reference) => reference.uri,
  );

  return referencesGroupedByUri;
}
