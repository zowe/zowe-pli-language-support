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
 * An offset range into the enclosing text: `start` inclusive, `end` exclusive - the one
 * convention every offset in this API uses (tokens, diagnostics, fragments, edits), and the
 * same as the language package's own `Range`. ANTLR's inclusive `stop` becomes `stop + 1` at
 * the engine boundary.
 */
export interface Range {
  start: number;
  end: number;
}

export interface Token {
  image: string;
  range: Range;
  semanticsKind: SemanticsKind;
}

export enum Severity {
  Error,
  Warning,
  Info,
  /** A severe (unrecoverable) error - the PL/I compiler's `S` level. */
  Severe,
}

export interface Diagnostic {
  severity: Severity;
  message: string;
  range: Range;
  code: string;
}

/**
 * The include statement a single-fragment parse recognized (`EXEC SQL INCLUDE member`):
 * `filePath` is the raw member *name*, `token` the member's token. Part of the engines'
 * {@link PreprocessorResult}, not of the {@link Preprocessor} contract - on the context
 * path the engine acts on it itself, via `PreprocessorContext.include`.
 */
export type PreprocessorReplacement = {
  type: "include";
  filePath: string;
  token: Token;
};

/**
 * Internal preprocessor parser result. Used within implementations, but not part of the
 * Preprocessor API contract.
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
  terminated: boolean;
}

/**
 * The shared text-editing API a {@link Preprocessor} uses to perform its replacements.
 */
export interface PreprocessorContext {
  /**
   * The input text into the preprocessor. Contains the full text of the current
   * compilation unit.
   */
  readonly text: string;
  /**
   * The uri of the document `text` came from - the entry file, or an included file's own
   * uri for a context created by {@link include}.
   */
  readonly documentUri: string;
  /** The uri of the compilation unit's entry file - the same for every nested context. */
  readonly unitUri: string;
  pushDiagnostic(diagnostic: Diagnostic): void;
  /**
   * Replaces `range` (offsets into `text`) with `text`, recording `tokens` as the replaced
   * statement's full classified token list - the host's only source for the statement's
   * semantic highlighting/hover, include-member metadata, and host-variable references
   * (every `SemanticsKind.Identifier` token becomes a linkable variable reference). Token
   * offsets are *host* coordinates (offsets into `context.text`, see `rebaseToken`).
   * A zero-width `range` inserts `text` at that offset (e.g. generated declarations);
   * a zero-width, empty-text replace is a pure annotation that only records `tokens`.
   */
  replace(range: Range, text: string, tokens?: Token[]): void;
  /**
   * Resolves the include statement at `statementRange`: looks `name` up, splices the
   * included file's text in place of the statement (keeping the included file's real
   * positions), blanks the statement itself, and returns a fresh context over the included
   * file's text. That context is **unprocessed**: the preprocessor must run its own
   * processing over it (recursively) before `execute` returns - the host applies the
   * nested context's edits only when it builds the including context. `tokens` is the
   * statement's classified token list, exactly as for {@link replace}. An unresolvable
   * `name` produces a diagnostic at `nameRange` (the member token's span), still blanks the
   * statement so the raw text never reaches the host parser, and returns `undefined`.
   */
  include(
    name: string,
    statementRange: Range,
    nameRange: Range,
    tokens?: Token[],
  ): Promise<PreprocessorContext | undefined>;
}

export interface Preprocessor {
  get name(): string;
  /**
   * The single entry point: finds every construct this preprocessor owns in
   * `context.text` itself - its `EXEC <keyword> ...;` statements as well as its host-side
   * built-ins (e.g. `SQL TYPE IS ...` attributes, `DFHRESP(...)`/`DFHVALUE(...)`, the
   * per-procedure runtime declarations) - and records everything on the context: text
   * replacements with their classified token lists, diagnostics, and include resolutions
   * (processing every context {@link PreprocessorContext.include} returns the same way).
   */
  execute(context: PreprocessorContext): Promise<void>;
}
