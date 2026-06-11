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

import { DEFAULT_INSTRUCTION_LIMIT } from "../src/preprocessor/instruction-interpreter";
import {
  plainItem,
  ProcessGroup,
  ProgramConfig,
} from "../src/workspace/plugin-configuration-provider";

/**
 * Test helper: build a {@link ProgramConfig} from plain fields. Production
 * code loads ProgramConfigs through the parser, which attaches source
 * locations to every leaf; tests just need the value, so we wrap each
 * field as a `plainItem` (no source location attached).
 */
export function makeProgramConfig(input: {
  program: string;
  pgroup: string;
  compilerOptions?: string[];
}): ProgramConfig {
  return {
    program: plainItem(input.program),
    pgroup: plainItem(input.pgroup),
    compilerOptions: (input.compilerOptions ?? []).map(plainItem),
  };
}

/**
 * Test helper: build a {@link ProcessGroup} from plain fields. Same idea
 * as {@link makeProgramConfig} — wrap leaves as `plainItem`s so tests can
 * keep using literal values.
 */
export function makeProcessGroup(input: {
  name: string;
  libs?: string[];
  compilerOptions?: string[];
  includeExtensions?: string[];
  memberNameValidation?: boolean;
  checkMargins?: boolean;
  instructionCounterLimit?: number;
  caseUpperValidation?: boolean;
}): ProcessGroup {
  return {
    name: plainItem(input.name),
    compilerOptions: (input.compilerOptions ?? []).map(plainItem),
    libs: (input.libs ?? []).map(plainItem),
    includeExtensions: (input.includeExtensions ?? []).map(plainItem),
    lspOptions: {
      checkMargins: plainItem(input.checkMargins ?? false),
      instructionCounterLimit: plainItem(
        input.instructionCounterLimit ?? DEFAULT_INSTRUCTION_LIMIT,
      ),
      caseUpperValidation: plainItem(input.caseUpperValidation ?? true),
    },
    memberNameValidation:
      input.memberNameValidation === undefined
        ? undefined
        : plainItem(input.memberNameValidation),
  };
}
