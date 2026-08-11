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

import { Diagnostic, ExecFragment, SemanticsKind, Token } from "./types";

/**
 * Rebases a diagnostic collected against `fragment.bodyText` (0-based offsets) into
 * `fragment`'s host document, by adding `fragment.bodyOffset`.
 */
export function rebaseDiagnostic(
  diagnostic: Diagnostic,
  fragment: ExecFragment,
): Diagnostic {
  return {
    ...diagnostic,
    startOffset: diagnostic.startOffset + fragment.bodyOffset,
    endOffset: diagnostic.endOffset + fragment.bodyOffset,
  };
}

/**
 * Rebases a token collected against `fragment.bodyText` (0-based offsets) into `fragment`'s
 * host document, by adding `fragment.bodyOffset` - the token counterpart of
 * {@link rebaseDiagnostic}. Tokens handed to `PreprocessorContext.replace` must be in host
 * coordinates (see the `Preprocessor` docs), so every parse-local token goes through this
 * once.
 */
export function rebaseToken(token: Token, fragment: ExecFragment): Token {
  return {
    ...token,
    startOffset: token.startOffset + fragment.bodyOffset,
    endOffset: token.endOffset + fragment.bodyOffset,
  };
}

/**
 * Describes the comment/string syntax a host language uses, so {@link scanExecFragments}
 * can skip over them - a `;` inside a string or comment doesn't end the statement, and
 * `EXEC <prefix>` text inside either doesn't start one. Confirmed against
 * `Db2SqlExecLexer.g4`/`CICSLexer.g4`: strings escape by doubling their own quote and
 * never span a line break; only CICS's `/* *\/` block comment can.
 */
export interface Delimiters {
  /** Each entry is both the start and end delimiter (e.g. `'` or `"`). */
  quotes: string[];
  /** Start marker; the comment runs to end of line (or EOF). */
  lineComments: string[];
  /** Start/end pair; may span multiple lines. */
  blockComments?: { start: string; end: string }[];
}

/**
 * If a quoted string, line comment, or block comment starts exactly at `text[from]`, returns
 * the offset right after it ends; otherwise `undefined`. An unterminated quote or block comment
 * runs to the next line break (or EOF) - the same recovery both grammars themselves fall back
 * to, rather than consuming the rest of the file.
 */
function skipDelimited(
  text: string,
  from: number,
  delimiters: Delimiters,
): number | undefined {
  const ch = text[from];
  if (delimiters.quotes.includes(ch)) {
    let i = from + 1;
    while (i < text.length && text[i] !== "\n" && text[i] !== "\r") {
      if (text[i] === ch) {
        if (text[i + 1] === ch) {
          i += 2; // doubled-quote escape (`''`/`""`) - still inside the string
          continue;
        }
        return i + 1; // closing quote
      }
      i++;
    }
    return i; // unterminated - stop at the line break (or EOF), matching the grammars
  }
  for (const marker of delimiters.lineComments) {
    if (text.startsWith(marker, from)) {
      const end = text.indexOf("\n", from + marker.length);
      return end === -1 ? text.length : end;
    }
  }
  for (const block of delimiters.blockComments ?? []) {
    if (text.startsWith(block.start, from)) {
      const end = text.indexOf(block.end, from + block.start.length);
      return end === -1 ? text.length : end + block.end.length;
    }
  }
  return undefined;
}

/** Finds the `;` that ends the statement starting at `from`, skipping any nested string/comment
 * content - or `undefined` if the statement never closes. */
function findTerminator(
  text: string,
  from: number,
  delimiters: Delimiters,
): number | undefined {
  let i = from;
  while (i < text.length) {
    if (text[i] === ";") {
      return i;
    }
    i = skipDelimited(text, i, delimiters) ?? i + 1;
  }
  return undefined;
}

/**
 * Scans `text` for every `EXEC <prefix> ...;` statement (case-insensitive) - the entry
 * point a {@link Preprocessor} uses to find its own fragments instead of being handed
 * them. Delimited constructs are skipped before the anchor is tried, so `EXEC` inside a
 * host string literal never matches.
 *
 * `delimiters` describes the *embedded* language and applies only between the anchor and
 * the terminating `;`. Outside fragments only the quote characters carry over: the
 * embedded language's comment markers are ordinary host code there (`X = A--B;` is PL/I
 * subtraction, not a DB2 `--` comment), and host comments were already blanked by the
 * pipeline's comment-strip pre-pass.
 */
export function scanExecFragments(
  text: string,
  prefix: string,
  delimiters: Delimiters,
): ExecFragment[] {
  const fragments: ExecFragment[] = [];
  const upperPrefix = prefix.toUpperCase();
  const hostDelimiters: Delimiters = {
    quotes: delimiters.quotes,
    lineComments: [],
  };
  // `\s*` (not `\s+`) after the prefix: an empty statement body (`EXEC SQL;` or
  // `EXEC SQL` at EOF) is still a fragment - the host tokenizer consumes it as one, so
  // skipping it here would leak the raw statement to the final parse. The inner `\s+`
  // is what prevents matching inside identifiers like `EXECUTE`.
  const execAnchor = /\bEXEC\s+(\w+)\s*/iy;
  let i = 0;
  while (i < text.length) {
    const skipTo = skipDelimited(text, i, hostDelimiters);
    if (skipTo !== undefined) {
      i = skipTo;
      continue;
    }
    execAnchor.lastIndex = i;
    const anchor = execAnchor.exec(text);
    if (anchor && anchor[1].toUpperCase() === upperPrefix) {
      const bodyStart = i + anchor[0].length;
      const semicolon = findTerminator(text, bodyStart, delimiters);
      if (semicolon !== undefined) {
        fragments.push({
          range: { start: i, end: semicolon + 1 },
          bodyText: text.slice(bodyStart, semicolon),
          bodyOffset: bodyStart,
          terminated: true,
        });
        i = semicolon + 1;
        continue;
      }
      // No `;` before EOF: emit the rest as an unterminated fragment so the statement
      // still gets parsed/diagnosed - see `ExecFragment.terminated`.
      fragments.push({
        range: { start: i, end: text.length },
        bodyText: text.slice(bodyStart),
        bodyOffset: bodyStart,
        terminated: false,
      });
      break;
    }
    i++;
  }
  return fragments;
}

/**
 * Builds the text a `Preprocessor` replaces an `EXEC` statement with: a single
 * `DO; ... END;` with PUT statements that contain the values of every identifier used in the statement.
 * Allows the host to see identifiers, link them and then provide LSP support later on.
 */
export function buildExecReplacement(tokens: Token[]): string {
  const named = tokens.filter(
    (token) => token.semanticsKind === SemanticsKind.Identifier,
  );
  let text = "DO;\n";
  for (const token of named) {
    text += "PUT(" + token.image + ");\n";
  }
  text += "END;";
  return text;
}
