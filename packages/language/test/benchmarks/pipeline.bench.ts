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
import { TextDocument } from "vscode-languageserver-textdocument";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { defaultTestWorkspace } from "../test-workspace";
import {
  generateFullFixture,
  generateMacroFixture,
  generatePlainFixture,
} from "./fixtures";

/**
 * Benchmarks the tokenize/preprocess hot path (margins, comment-strip, MACRO/SQL/CICS
 * phases, source-map composition, final lex, annotate). Run with `pnpm vitest bench`.
 * See `phases.bench.ts` for per-lifecycle-piece numbers.
 */

const lexer = new PliLexer();

const variants: [string, (targetLines: number) => string][] = [
  ["full pipeline", generateFullFixture],
  ["no preprocessors", generatePlainFixture],
  ["macro only", generateMacroFixture],
];

for (const [name, generate] of variants) {
  describe(name, () => {
    for (const targetLines of [1_000, 10_000, 100_000]) {
      const text = generate(targetLines);
      const uri = UriUtils.toUri(`/test/perf-${targetLines}.pli`);
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      bench(
        `tokenize ${targetLines.toLocaleString("en-US")} lines`,
        async () => {
          const unit = await createCompilationUnit(uri, defaultTestWorkspace());
          await lexer.tokenize(unit, document, uri);
        },
        { warmupIterations: 1, iterations: 3, time: 0 },
      );
    }
  });
}
