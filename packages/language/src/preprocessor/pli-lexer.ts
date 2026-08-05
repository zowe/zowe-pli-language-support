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

import { MarginsProcessor, PliMarginsProcessor } from "./pli-margins-processor";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Reference, Statement } from "../syntax-tree/ast";
import { Token } from "../parser/tokens";
import { EvaluationResults } from "./instruction-interpreter";
import { tokenize } from "../parser/tokenizer";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompilerOptionResult,
  CompilerOptions,
  getDefaultCompilerOptions,
} from "./compiler-options/options";
import { CompilerOptions as PliCompilerOptions } from "./compiler-options/options-pli";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { updatePliTokenizer } from "../parser/tokenizer/pli-tokenizer";
import { PipelineResult, runPipeline } from "./pp-pipeline";
import { PreprocessorPhase } from "./pp-phase";
import { MacroPreprocessorPhase } from "./macro-phase";
import {
  ExecCicsPreprocessorPhase,
  ExecSqlPreprocessorPhase,
  UnresolvedExecPhase,
} from "./exec-phase";
import { PreparedSource } from "./instruction-cache";
import { commentRangesToTokens, stripComments } from "./comment-stripper";
import { SourceMap } from "./source-map";
import { AnnotateResult, annotateTokens } from "./token-annotator";

export interface LexerResult {
  all: Token[];
  /** The final pipeline text that `all` was lexed from. */
  preprocessedText: string;
  compilerOptions: CompilerOptionsProcessorResult;
  statements: Statement[];
  evaluationResults: EvaluationResults;
  tokenReferences: Reference[];
}

/**
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor.
 *
 * Pipeline: margins + comment-strip produce the text
 * that seeds the ordered `PP()` phases, each a `{text, sourceMap} -> {text, sourceMap}`
 * transform whose maps compose into one map from the original document to the pipeline's
 * final text. That text is lexed exactly once, and `annotateTokens` uses the composed map
 * to recover original positions and cross-reference metadata for the real parser.
 */
export class PliLexer {
  readonly compilerOptionsPreprocessor: CompilerOptionsProcessor;
  readonly marginsProcessor: MarginsProcessor;

  constructor() {
    this.compilerOptionsPreprocessor = new CompilerOptionsProcessor();
    this.marginsProcessor = new PliMarginsProcessor();
  }

  async tokenize(
    unit: CompilationUnit,
    document: TextDocument,
    uri: URI,
  ): Promise<LexerResult> {
    const inputText = document.getText();

    // Compiler options
    const compilerOptionsResult =
      this.compilerOptionsPreprocessor.extractCompilerOptions(
        inputText,
        uri,
        unit.services.workspace,
      );
    const opts =
      compilerOptionsResult.result?.options ?? getDefaultCompilerOptions();
    unit.compilerOptions = opts;
    updatePliTokenizer(opts);
    unit.instructionCache.update(compilerOptionsResult.recompileFingerprint);
    unit.tokenizationCache.update(compilerOptionsResult.recompileFingerprint);

    // Margins + comment-strip -> the text that seeds the phase pipeline.
    const prepared = await unit.tokenizationCache.get(uri, inputText, () =>
      this.prepareSource(unit, uri, compilerOptionsResult),
    );

    // Run the preprocessor pipeline (MACRO, SQL, CICS according to PP()).
    const phases = buildPhases(
      opts,
      compilerOptionsResult.result,
      this.marginsProcessor,
    );
    const pipeline = await runPipeline(phases, {
      text: prepared.text,
      sourceMap: SourceMap.identity(prepared.text, uri),
      unit,
      uri,
      textDocument: document,
    });

    // Lex the pipeline's final composed text exactly once, then recover original
    // positions and cross-reference metadata via the composed source map.
    const finalTokenization = tokenize(pipeline.text, uri);
    const annotated = annotateTokens(
      finalTokenization.tokens,
      finalTokenization.diagnostics,
      pipeline.sourceMap,
      uri,
    );

    // Publish diagnostics, register the file's tokens, and assemble the result.
    this.reportDiagnostics(
      unit,
      uri,
      compilerOptionsResult,
      prepared,
      pipeline,
      annotated,
    );
    this.registerFileTokens(
      unit,
      document,
      uri,
      compilerOptionsResult,
      annotated,
      pipeline.directiveTokens,
      prepared,
    );

    return {
      all: annotated.tokens,
      preprocessedText: pipeline.text,
      compilerOptions: compilerOptionsResult,
      statements: pipeline.statements,
      evaluationResults: pipeline.evaluationResults,
      tokenReferences: pipeline.references,
    };
  }

  /**
   * Applies margins, then strips comments (so external SQL/CICS preprocessors - which will
   * scan full text rather than tokens - never see comment characters embedded in `EXEC`
   * code), producing the text that seeds the phase pipeline. Also converts the stripped
   * comment ranges into tokens for LSP services (semantic highlighting, hover-on-comment,
   * ...); the file's *real* tokens are registered later, from `LexerResult.all` (see
   * `registerFileTokens`), not re-tokenized here.
   *
   * Margin diagnostics are folded into the result so they stay correct on cache hits (the
   * pipeline reuses the same margins processor for %INCLUDE files and would otherwise
   * overwrite `marginsProcessor.issues`).
   */
  private prepareSource(
    unit: CompilationUnit,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
  ): PreparedSource {
    const textWithoutMargins = this.marginsProcessor.processMargins(
      compilerOptionsResult,
      uri,
      unit.services.workspace,
    );
    const marginIssues = [...this.marginsProcessor.issues];
    const { text, comments } = stripComments(textWithoutMargins);
    return {
      text,
      // Comment text must come from the *pre-strip* text - `text` has every comment
      // already blanked to whitespace.
      comments: commentRangesToTokens(comments, textWithoutMargins, uri),
      diagnostics: marginIssues,
    };
  }

  /**
   * Publish the diagnostics collected across all stages.
   */
  private reportDiagnostics(
    unit: CompilationUnit,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
    prepared: PreparedSource,
    pipeline: PipelineResult,
    annotated: AnnotateResult,
  ): void {
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, prepared.diagnostics);
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, pipeline.diagnostics);
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, annotated.diagnostics);
    const uriString = uri.toString();
    unit.diagnostics.addAll(
      DiagnosticCategory.CompilerOptions,
      (compilerOptionsResult.result?.issues ?? []).filter(
        (e) => e.uri === uriString,
      ),
    );
  }

  /**
   * Register the file's tokens with the file store. Registers `annotated.tokens` - the
   * exact objects `LexerResult.all` returns and the real parser will mutate with
   * `.kind`/`.element` - so LSP services reading `unit.services.files.getTokens(uri)`
   * later (after parsing) see those attachments too. Registering a separately re-tokenized
   * array here would silently desync from what the parser actually built the CST from.
   *
   * Also merges in this file's own `directiveTokens` (see `PhaseResult.directiveTokens`) -
   * `%IF`/`%DCL`/`EXEC`/... tokens consumed by a directive and otherwise unreachable, needed
   * by `pli/skippedCode`, type-at-a-`%DCL`, semantic highlighting of macro variable
   * references, and similar features that inspect a directive rather than its expansion.
   */
  private registerFileTokens(
    unit: CompilationUnit,
    document: TextDocument,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
    annotated: AnnotateResult,
    directiveTokens: Token[],
    prepared: PreparedSource,
  ): void {
    const optionTokens = compilerOptionsResult.result?.tokens ?? [];
    const optionComments = compilerOptionsResult.result?.comments ?? [];
    const uriString = uri.toString();
    const ownDirectiveTokens = directiveTokens.filter(
      (t) => t.uri?.toString() === uriString,
    );
    // `annotated.tokens` spans the whole composed text, so it also carries tokens that
    // annotateTokens attributed to a foreign file (e.g. content pulled in via `%INCLUDE`/
    // `EXEC SQL INCLUDE`). Those tokens' offsets are only meaningful in *that* file's own
    // numbering - registering them here too would collide with this file's own tokens at
    // the same numeric offset (see the `EXEC SQL INCLUDE <file>` case, which replaces the
    // whole directive's span). The foreign file gets its own, correctly-offset registration
    // independently (see `runInclude`), so this file's own view only needs its own tokens.
    // `synthetic` tokens (lexed from generated text, offsets collapsed to the directive's
    // start) are excluded - see `Token.synthetic`.
    const ownTokens = annotated.tokens.filter(
      (t) => !t.synthetic && t.uri?.toString() === uriString,
    );
    // Identity-dedupe: an `EXEC` host-variable sub-token is registered as a directive
    // token by the SQL/CICS phase AND emitted verbatim into the final token stream by the
    // annotate pass (`MappedToken.sourceToken`), so it shows up in both lists.
    const tokens = [
      ...new Set([...optionTokens, ...ownTokens, ...ownDirectiveTokens]),
    ];
    tokens.sort((a, b) => a.startOffset - b.startOffset);
    unit.services.files.set({
      textDocument: document,
      tokens,
      comments: [...optionComments, ...prepared.comments],
      uri,
    });
    // The final stream's tokens attributed to a foreign file belong in *that* file's
    // registration (their offsets are file-local, see the `ownTokens` note above). The
    // real parser runs after this and attaches `.kind`/`.element` to these exact objects,
    // so merging them (replacing the include registration's raw, never-annotated tokens)
    // is what gives an included file its own semantic highlighting/hover/definition. Same
    // identity-dedupe as above.
    const foreignTokens = annotated.tokens.filter(
      (t) => !t.synthetic && t.uri && t.uri.toString() !== uriString,
    );
    this.mergeForeignTokens(
      unit,
      [...new Set([...directiveTokens, ...foreignTokens])],
      uriString,
    );
  }

  /**
   * Merges final-stream tokens that belong to a *foreign* file into that file's own
   * registration: content spliced in via `%INCLUDE`/`EXEC SQL INCLUDE` re-surfaces in the
   * composed text with the include's own uri/offsets, and directive tokens (an `EXEC`
   * statement inside an included file, its classified sub-tokens, ...) are remapped there
   * too. Both carry - or will receive, from the real parse - `.kind`/`.element`/
   * `ppSemanticType`, while the include's base registration (`runInclude`, the SQL/CICS
   * phase's `files.set`) only holds the raw, unannotated tokenization. Replace the raw
   * tokens the incoming ones cover, keeping the array sorted and overlap-free.
   */
  private mergeForeignTokens(
    unit: CompilationUnit,
    incomingTokens: Token[],
    ownUriString: string,
  ): void {
    const byUri = new Map<string, Token[]>();
    for (const token of incomingTokens) {
      const tokenUri = token.uri?.toString();
      if (!tokenUri || tokenUri === ownUriString) {
        continue;
      }
      let list = byUri.get(tokenUri);
      if (!list) {
        list = [];
        byUri.set(tokenUri, list);
      }
      list.push(token);
    }
    for (const [foreignUri, foreignTokens] of byUri) {
      const existing = unit.services.files.get(foreignUri);
      if (!existing) {
        continue;
      }
      foreignTokens.sort((a, b) => a.startOffset - b.startOffset);
      let index = 0;
      const merged = existing.tokens.filter((token) => {
        while (
          index < foreignTokens.length &&
          foreignTokens[index].endOffset < token.startOffset
        ) {
          index++;
        }
        return !(
          index < foreignTokens.length &&
          foreignTokens[index].startOffset <= token.endOffset
        );
      });
      merged.push(...foreignTokens);
      merged.sort((a, b) => a.startOffset - b.startOffset);
      unit.services.files.set({ ...existing, tokens: merged });
    }
  }
}

/**
 * Build the preprocessor phase list from the PP() compiler option.
 * The PP option contains an ordered list of preprocessor items
 * (MACRO, SQL, CICS, INCLUDE), and each maps to a PreprocessorPhase.
 * The phases run sequentially: {text,sourceMap} -> Phase1 -> {text,sourceMap} -> Phase2 -> ...
 */
function buildPhases(
  opts: CompilerOptions,
  compilerOptionsResult: CompilerOptionResult | undefined,
  marginsProcessor: MarginsProcessor,
): PreprocessorPhase[] {
  const phases: PreprocessorPhase[] = [];
  const pp = opts.pp;

  if (!pp || !pp.items) {
    // No PP items at all (the *documented* default, `getDefaultCompilerOptions`, does
    // carry PP(MACRO SQL CICS) - this branch means the options explicitly ended up
    // without any) - run just the macro phase.
    phases.push(
      new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
    );
    // Neither CICS nor SQL is configured, so any EXEC CICS/SQL
    // statement in the source is unresolved.
    phases.push(new UnresolvedExecPhase(false, false));
    return phases;
  }

  let hasMacroPhase = false;
  let hasSqlPhase = false;
  let hasCicsPhase = false;

  for (const item of pp.items) {
    switch (item.name) {
      case PliCompilerOptions.PPItemName.MACRO:
        // Each explicit MACRO item is its own pass, so e.g. PP(MACRO MACRO) runs the
        // macro preprocessor twice. A second pass can expand macro code that the first
        // pass generated.
        hasMacroPhase = true;
        phases.push(
          new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
        );
        break;
      case PliCompilerOptions.PPItemName.INCLUDE:
        // INCLUDE is handled by the macro phase (the instruction interpreter processes
        // %INCLUDE/++INCLUDE). Only add a macro phase for it if none exists yet.
        if (!hasMacroPhase) {
          hasMacroPhase = true;
          phases.push(
            new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
          );
        }
        break;
      case PliCompilerOptions.PPItemName.SQL:
        hasSqlPhase = true;
        phases.push(
          new ExecSqlPreprocessorPhase(compilerOptionsResult, marginsProcessor),
        );
        break;
      case PliCompilerOptions.PPItemName.CICS:
        hasCicsPhase = true;
        phases.push(
          new ExecCicsPreprocessorPhase(
            compilerOptionsResult,
            marginsProcessor,
          ),
        );
        break;
    }
  }

  // Runs unconditionally, last, after every configured phase above has already had a
  // chance to process the token stream to detect a unconfigured EXEC CICS/SQL statement.
  phases.push(new UnresolvedExecPhase(hasCicsPhase, hasSqlPhase));

  return phases;
}
