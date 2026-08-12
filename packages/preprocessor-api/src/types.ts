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

export enum SemanticsKind {
  Identifier,
  Keyword,
  String,
  Comment,
  Number,
}

/**
 * An offset span in ANTLR's convention: `endOffset` is *inclusive* (the last covered
 * character, i.e. a token's `stop`).
 */
export interface WithRange {
  startOffset: number;
  endOffset: number;
}

/**
 * An offset range using the language package's own `{start, end}` naming (as opposed to
 * {@link WithRange}'s `{startOffset, endOffset}`, used by `Token`/`Diagnostic`) - so
 * `PreprocessorContext.replace`/`ExecFragment.range` match the language `Range` type
 * directly, with no field-renaming conversion at the boundary.
 */
export interface Range {
  start: number;
  end: number;
}

export interface Token extends WithRange {
  image: string;
  semanticsKind: SemanticsKind;
}

export enum Severity {
  Error,
  Warning,
  Info,
}

export interface Diagnostic extends WithRange {
  severity: Severity;
  message: string;
  code: string;
}

/**
 * The include statement a single-fragment parse recognized (`EXEC SQL INCLUDE member`):
 * `filePath` is the raw member *name*, `token` the member's token. Part of the engines'
 * {@link PreprocessorResult}, not of the {@link Preprocessor} contract - on the context
 * path the engine acts on it itself, via `PreprocessorContext.resolveInclude`.
 */
export type PreprocessorReplacement = {
  type: "include";
  filePath: string;
  token: Token;
};

/**
 * What an engine's single-fragment `parse` produces (offsets local to the parsed body).
 * Not part of the {@link Preprocessor} contract - the host only sees what `execute(context)`
 * records on the context. Kept here so both engine packages share one shape (their public
 * `parse` backs the per-command unit tests).
 */
export interface PreprocessorResult {
  diagnostics: Diagnostic[];
  tokens: Token[];
  replacement: PreprocessorReplacement | null;
}

/**
 * The `EXEC SQL`/`EXEC CICS` fragment a {@link Preprocessor} is asked to replace: `range` is
 * the whole `EXEC ... ;` statement's span in the host document, `bodyText` is the fragment's
 * text with the `SQL`/`CICS` prefix already stripped (what the preprocessor's own grammar
 * parses), and `bodyOffset` is that body's start offset within the host document - added to
 * any offset `bodyText`'s own parse produces, to rebase it into `range`'s coordinate space.
 */
export interface ExecFragment {
  range: Range;
  bodyText: string;
  bodyOffset: number;
  /**
   * `false` when no terminating `;` exists before EOF (then `range`/`bodyText` run to the
   * end of the text; only ever the scan's last fragment). The statement is broken source -
   * a preprocessor should still parse and diagnose it, but must not replace its text (the
   * host parser's own missing-terminator error has to keep pointing at the raw statement);
   * it records the classified tokens with a zero-width, empty-text `replace` at
   * `range.start` instead.
   */
  terminated: boolean;
}

/**
 * The shared text-editing API a {@link Preprocessor} uses to perform its own `EXEC`
 * replacement. Implemented by the language package;
 * preprocessors only ever consume it through this interface.
 */
export interface PreprocessorContext {
  readonly text: string;
  pushDiagnostic(diagnostic: Diagnostic): void;
  /**
   * Replaces `range` (offsets into `text`) with `text`, recording `tokens` as the replaced
   * statement's full classified token list - the host's only source for the statement's
   * semantic highlighting/hover and include-member metadata. Token offsets are *host*
   * coordinates (offsets into `context.text`, see `rebaseToken`); the host locates each
   * `SemanticsKind.Identifier` image inside the replacement text itself (they appear
   * verbatim, in token order - see `buildExecReplacement`) to keep those references
   * resolvable. A zero-width, empty-text replace is a pure annotation: it changes nothing
   * in the generated text but still records the tokens (used for unterminated statements,
   * see `ExecFragment.terminated`).
   */
  replace(range: Range, text: string, tokens?: Token[]): void;
  /**
   * `range` is the include statement's span in `context.text` - used to anchor the
   * "include could not be resolved" diagnostic (without it the diagnostic has no position
   * and is dropped) and to locate the include site's enclosing scope.
   */
  resolveInclude(
    name: string,
    range?: Range,
  ): Promise<PreprocessorContext | undefined>;
  /**
   * Splices `nested` (a context previously returned by `resolveInclude`, with its own edits
   * already applied) in at `offset`, preserving its own real positions instead of collapsing
   * it into one opaque block - see the language package's `Segment.foreign`.
   *
   * `nested` MUST be a context obtained from this host's `resolveInclude` - the host relies
   * on its own concrete implementation to build the spliced result. Passing any other
   * `PreprocessorContext` implementation throws.
   */
  insertContext(offset: number, nested: PreprocessorContext): void;
}

export interface Preprocessor {
  get name(): string;
  /**
   * The single entry point: finds every `EXEC <this preprocessor's keyword>` statement in
   * `context.text` itself (see `scanExecFragments`) and records everything on the context -
   * text replacements (with each statement's full classified token list, see
   * {@link PreprocessorContext.replace}), diagnostics, and include resolutions. There is
   * deliberately no per-statement "parse this snippet" call: a preprocessor may eventually
   * run as an external process, where "here is the full text, record your edits" is the
   * only contract that survives the boundary.
   */
  execute(context: PreprocessorContext): Promise<void>;
}
