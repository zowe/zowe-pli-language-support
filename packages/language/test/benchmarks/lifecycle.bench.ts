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

import { bench, describe } from "vitest";
import { CancellationToken } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { lifecycle } from "../../src/workspace/lifecycle";
import { defaultTestWorkspace } from "../test-workspace";
import { generateFullFixture, generatePlainFixture } from "./fixtures";

/**
 * Benchmarks the whole document lifecycle (tokenize/preprocess, parse, symbol table, link,  validate).
 */

const variants: [string, (targetLines: number) => string][] = [
  ["full lifecycle", generateFullFixture],
  ["full lifecycle, no preprocessors", generatePlainFixture],
];

for (const [name, generate] of variants) {
  describe(name, () => {
    for (const targetLines of [1_000, 10_000, 100_000]) {
      const text = generate(targetLines);
      const uri = UriUtils.toUri(`/test/lifecycle-${targetLines}.pli`);
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      bench(
        `build ${targetLines.toLocaleString("en-US")} lines`,
        async () => {
          const unit = await createCompilationUnit(uri, defaultTestWorkspace());
          await lifecycle(unit, document, CancellationToken.None);
        },
        { warmupIterations: 1, iterations: 3, time: 0 },
      );
    }
  });
}
