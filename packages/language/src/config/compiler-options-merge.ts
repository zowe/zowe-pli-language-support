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

import { Diagnostic } from "../language-server/types";
import {
  AbstractCompilerOptions,
  parseAbstractCompilerOptions,
} from "../preprocessor/compiler-options/parser";
import { JsonItem } from "./schema";

/**
 * Merges compiler options from a program config and its process group into
 * a single {@link AbstractCompilerOptions}. Pure: takes the raw option
 * strings (with their JSON provenance) and returns the parsed result plus
 * the issues encountered.
 *
 * Order matters: program-config options come first, then process-group
 * options. The compiler-options translator processes them in that order,
 * which is what allows the source-file `*PROCESS` directives (translated
 * later) to detect duplicate / mutually-exclusive options against the
 * config-supplied set.
 */
export function mergeAbstractOptions(
  programOptions: JsonItem<string>[],
  groupOptions: JsonItem<string>[] | undefined,
): { abstractOptions: AbstractCompilerOptions; issues: Diagnostic[] } {
  const abstractOptions: AbstractCompilerOptions = {
    options: [],
    tokens: [],
    issues: [],
    comments: [],
  };
  for (const option of programOptions) {
    const parsed = parseAbstractCompilerOptions(option.value);
    abstractOptions.options.push(...parsed.options);
    abstractOptions.tokens.push(...parsed.tokens);
    abstractOptions.issues.push(...parsed.issues);
  }
  if (groupOptions) {
    for (const option of groupOptions) {
      const parsed = parseAbstractCompilerOptions(option.value);
      abstractOptions.options.push(...parsed.options);
      abstractOptions.tokens.push(...parsed.tokens);
      abstractOptions.issues.push(...parsed.issues);
    }
  }
  return { abstractOptions, issues: abstractOptions.issues };
}
