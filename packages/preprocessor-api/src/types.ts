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
 * An offset range into the enclosing text: `start` inclusive, `end` exclusive.
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
  /** Used for PL/I compatibility */
  Severe,
}

export interface Diagnostic {
  severity: Severity;
  message: string;
  range: Range;
  code: string;
}

/**
 * Include statements like `EXEC SQL INCLUDE SOMETHING;` can use this.
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
 * The `EXEC SQL`/`EXEC CICS` fragment a {@link Preprocessor} is asked to replace.
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
   * statement's full classified token list.
   */
  replace(range: Range, text: string, tokens?: Token[]): void;
  /**
   * Resolves the include statement at `statementRange`: looks `name` up, splices the
   * included file's text in place of the statement (keeping the included file's real
   * positions), blanks the statement itself, and returns a fresh context over the included
   * file's text.
   *
   * The returned context is *unprocessed*: the engine MUST run its own processing against
   * it (recursively, like the host called `execute` on it), or the included file's text is
   * spliced in raw and its own `EXEC` statements reach the host parser unchanged.
   * `undefined` means the include did not resolve (already diagnosed by the host).
   *
   * May reject with the host's cancellation error when the build was superseded. Never
   * swallow errors from this call - rethrow anything that is not handled specifically,
   * or cancellation stops working.
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
  execute(context: PreprocessorContext): Promise<void>;
}
