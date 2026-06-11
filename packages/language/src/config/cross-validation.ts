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

import { ProgramConfig } from "./schema";
import {
  Diagnostic,
  diagnosticFromCodeAtRange,
  offsetLengthToRange,
} from "../language-server/types";
import { LspCodes } from "../validation/lsp-codes";

/**
 * Check for unknown process groups references under "pgm_conf.json"
 * by comparing with existing process group names at "proc_grps.json"
 * If there are values to compare and a mismatch between them is found,
 * throw UnknownProcessGroup(COPC04).
 */
export function validatePgroupReferences(
  programs: Iterable<ProgramConfig>,
  pgroupNames: Set<string>,
  uri: string,
): Diagnostic[] {
  if (!pgroupNames.size || !uri) {
    return [];
  }
  const result: Diagnostic[] = [];
  for (const program of programs) {
    const pgroupReference = program.pgroup.value;
    if (!pgroupNames.has(pgroupReference)) {
      const range = program.pgroup.meta?.range ?? offsetLengthToRange(0, 1);
      const diagnostic = diagnosticFromCodeAtRange(
        LspCodes.PluginConfiguration.UnknownProcessGroup,
        range,
        pgroupReference,
      );
      diagnostic.uri = uri;
      result.push(diagnostic);
    }
  }

  return result;
}
