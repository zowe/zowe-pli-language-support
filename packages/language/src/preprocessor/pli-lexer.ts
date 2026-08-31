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

import { MarginsProcessor } from "./pli-margins-processor";
import { URI } from "../utils/uri";
import { largePush } from "../utils/collections";
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
    this.marginsProcessor = new MarginsProcessor();
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
        unit,
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
   * Applies margins, then strips comments (see `stripComments`), producing the text that
   * seeds the phase pipeline plus the comment tokens for LSP services. Margin diagnostics
   * are folded into the (cached) result so they stay correct on cache hits - the shared
   * margins processor would otherwise overwrite `marginsProcessor.issues`.
   */
  private prepareSource(
    unit: CompilationUnit,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
  ): PreparedSource {
    const textWithoutMargins = this.marginsProcessor.processMargins(
      compilerOptionsResult,
      uri,
      unit,
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
   * Registers the file's tokens with the file store - the exact objects the real parser
   * will annotate with `.kind`/`.element`, so LSP services see those attachments too
   * (a separately re-tokenized array would silently desync). Also merges in this file's
   * own `directiveTokens`: `%IF`/`%DCL`/`EXEC`/... tokens consumed by a directive and
   * otherwise unreachable, needed by features that inspect a directive rather than its
   * expansion.
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
    // Only this file's own tokens: foreign-file tokens carry offsets in *that* file's
    // numbering and would collide with this file's tokens at the same numeric offset
    // (they're merged into the foreign file's registration below). `synthetic` tokens
    // are excluded - see `Token.synthetic`.
    // Identity-dedupe: an `EXEC` host-variable sub-token shows up both as a directive
    // token and as an annotate-emitted `sourceToken`. Only the option/directive side is
    // ever duplicated and it is tiny, so dedupe against that instead of pushing the
    // full file's tokens (millions on large files) through a Set.
    const smallSide = new Set([...optionTokens, ...ownDirectiveTokens]);
    const tokens: Token[] = [...smallSide];
    for (const token of annotated.tokens) {
      if (
        !token.synthetic &&
        token.uri?.toString() === uriString &&
        !smallSide.has(token)
      ) {
        tokens.push(token);
      }
    }
    tokens.sort((a, b) => a.startOffset - b.startOffset);
    unit.services.files.set({
      textDocument: document,
      tokens,
      comments: [...optionComments, ...prepared.comments],
      uri,
    });
    // Tokens attributed to a foreign file belong in that file's registration - see
    // `mergeForeignTokens`. Same identity-dedupe as above (against the small
    // directive-token side only).
    const directiveSet = new Set(directiveTokens);
    const incomingTokens: Token[] = [...directiveSet];
    for (const token of annotated.tokens) {
      if (
        !token.synthetic &&
        token.uri &&
        token.uri.toString() !== uriString &&
        !directiveSet.has(token)
      ) {
        incomingTokens.push(token);
      }
    }
    this.mergeForeignTokens(unit, incomingTokens, uriString);
  }

  /**
   * Merges final-stream tokens that belong to a *foreign* file into that file's own
   * registration. Included content re-surfaces in the composed text with the include's
   * own uri/offsets and carries (or will receive from the real parse) `.kind`/`.element`/
   * `ppSemanticType` - while the include's base registration only holds the raw,
   * unannotated tokenization. Replaces the raw tokens the incoming ones cover, keeping
   * the array sorted and overlap-free.
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
      largePush(merged, foreignTokens);
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
    // Options explicitly ended up without any PP items: run just the macro phase, and
    // flag any EXEC CICS/SQL statement as unresolved.
    phases.push(
      new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
    );
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
