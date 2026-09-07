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
   */
  replace(range: Range, text: string, tokens?: Token[]): void;
  /**
   * Resolves the include statement at `statementRange`: looks `name` up, runs the host's
   * own processing over the included file (recursively), and replaces the statement with
   * the result, keeping the included file's real positions. `tokens` is the statement's
   * classified token list, exactly as for {@link replace}. An unresolvable `name` produces
   * a diagnostic at `nameRange` (the member token's span) and still blanks the statement,
   * so the raw text never reaches the host parser.
   */
  include(
    name: string,
    statementRange: Range,
    nameRange: Range,
    tokens?: Token[],
  ): Promise<void>;
}

export interface Preprocessor {
  get name(): string;
  execute(context: PreprocessorContext): Promise<void>;
}
