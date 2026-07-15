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
import { preprocessorParse } from "../../src/parser/parser-entry";
import { ParserState } from "../../src/parser/parser-state";
import { tokenize } from "../../src/parser/tokenizer";
import { updatePliTokenizer } from "../../src/parser/tokenizer/pli-tokenizer";
import { stripComments } from "../../src/preprocessor/comment-stripper";
import { CompilerOptionsProcessor } from "../../src/preprocessor/compiler-options-processor";
import { getDefaultCompilerOptions } from "../../src/preprocessor/compiler-options/options";
import {
  ExecCicsPreprocessorPhase,
  ExecSqlPreprocessorPhase,
} from "../../src/preprocessor/exec-phase";
import {
  createMacroHandlers,
  MacroPreprocessorPhase,
} from "../../src/preprocessor/macro-phase";
import { PliMarginsProcessor } from "../../src/preprocessor/pli-margins-processor";
import { SourceMap } from "../../src/preprocessor/source-map";
import { annotateTokens } from "../../src/preprocessor/token-annotator";
import { serializeTokens } from "../../src/preprocessor/token-serializer";
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import { defaultTestWorkspace } from "../test-workspace";
import { generatePlainFixture } from "./fixtures";

/**
 * Per-piece benchmarks of the `PliLexer.tokenize` lifecycle over the *plain* PL/I fixture
 * (no `%` statements, no `EXEC` fragments), to attribute where the "no preprocessors"
 * pipeline time actually goes. Every piece receives the same input `PliLexer` would hand
 * it at that point of the pipeline. Run with `pnpm vitest bench`.
 *
 * Note the whole-phase benches (macro/sql/cics) each internally re-tokenize their input,
 * so the standalone `tokenize` number is a component of each of them.
 */

const BENCH_OPTIONS = { warmupIterations: 1, iterations: 3, time: 0 };

for (const targetLines of [10_000, 100_000]) {
  const text = generatePlainFixture(targetLines);
  const uri = UriUtils.toUri(`/test/phases-${targetLines}.pli`);
  const document = TextDocument.create(uri.toString(), "pli", 0, text);
  const workspace = defaultTestWorkspace();
  const unit = await createCompilationUnit(uri, workspace);

  // Reproduce PliLexer.tokenize's setup steps once, so each bench gets the exact
  // intermediate input it would see in the real pipeline.
  const optionsProcessor = new CompilerOptionsProcessor();
  const marginsProcessor = new PliMarginsProcessor();
  const optionsResult = optionsProcessor.extractCompilerOptions(
    text,
    uri,
    unit.services.workspace,
  );
  const opts = optionsResult.result?.options ?? getDefaultCompilerOptions();
  updatePliTokenizer(opts);
  const marginText = marginsProcessor.processMargins(
    optionsResult,
    uri,
    unit.services.workspace,
  );
  const strippedText = stripComments(marginText).text;
  const lexed = tokenize(strippedText, uri);
  const macroPhase = new MacroPreprocessorPhase(
    optionsResult.result,
    marginsProcessor,
  );
  const sqlPhase = new ExecSqlPreprocessorPhase(
    optionsResult.result,
    marginsProcessor,
  );
  const cicsPhase = new ExecCicsPreprocessorPhase(
    optionsResult.result,
    marginsProcessor,
  );
  const phaseInput = () => ({
    text: strippedText,
    sourceMap: SourceMap.identity(strippedText, uri),
    unit,
    uri,
    textDocument: document,
  });

  describe(`lifecycle pieces, ${targetLines.toLocaleString("en-US")} lines (plain PLI)`, () => {
    bench(
      "create compilation unit",
      async () => {
        await createCompilationUnit(uri, workspace);
      },
      BENCH_OPTIONS,
    );
    bench(
      "compiler options scan",
      () => {
        optionsProcessor.extractCompilerOptions(
          text,
          uri,
          unit.services.workspace,
        );
      },
      BENCH_OPTIONS,
    );
    bench(
      "margins",
      () => {
        marginsProcessor.processMargins(
          optionsResult,
          uri,
          unit.services.workspace,
        );
      },
      BENCH_OPTIONS,
    );
    bench(
      "strip comments",
      () => {
        stripComments(marginText);
      },
      BENCH_OPTIONS,
    );
    bench(
      "tokenize",
      () => {
        tokenize(strippedText, uri);
      },
      BENCH_OPTIONS,
    );
    bench(
      "preprocessor parse (macro handlers)",
      async () => {
        await preprocessorParse(
          new ParserState(lexed.tokens, opts),
          createMacroHandlers(opts, document),
        );
      },
      BENCH_OPTIONS,
    );
    bench(
      "serialize tokens",
      () => {
        serializeTokens(lexed.tokens, uri, strippedText);
      },
      BENCH_OPTIONS,
    );
    bench(
      "macro phase (whole)",
      async () => {
        await macroPhase.execute(phaseInput());
      },
      BENCH_OPTIONS,
    );
    bench(
      "sql phase (whole)",
      async () => {
        await sqlPhase.execute(phaseInput());
      },
      BENCH_OPTIONS,
    );
    bench(
      "cics phase (whole)",
      async () => {
        await cicsPhase.execute(phaseInput());
      },
      BENCH_OPTIONS,
    );
    bench(
      "compose source maps (identity x identity)",
      () => {
        SourceMap.compose(
          SourceMap.identity(strippedText, uri),
          SourceMap.identity(strippedText, uri),
        );
      },
      BENCH_OPTIONS,
    );
    bench(
      "annotate tokens",
      () => {
        // Identity map, so the in-place offset rewrite is idempotent across iterations.
        annotateTokens(
          lexed.tokens,
          lexed.diagnostics,
          SourceMap.identity(strippedText, uri),
          uri,
        );
      },
      BENCH_OPTIONS,
    );
  });
}
