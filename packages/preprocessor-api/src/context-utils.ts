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

import { Diagnostic, ExecFragment, Token } from "./types";

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
    range: {
      start: diagnostic.range.start + fragment.bodyOffset,
      end: diagnostic.range.end + fragment.bodyOffset,
    },
  };
}

/**
 * Rebases a token collected against `fragment.bodyText` (0-based offsets) into `fragment`'s
 * host document, by adding `fragment.bodyOffset`.
 */
export function rebaseToken(token: Token, fragment: ExecFragment): Token {
  return {
    ...token,
    range: {
      start: token.range.start + fragment.bodyOffset,
      end: token.range.end + fragment.bodyOffset,
    },
  };
}

/**
 * Describes the comment/string syntax a host language uses, so {@link scanExecFragments}
 * can skip over them.
 */
export interface Delimiters {
  /** Each entry is both the start and end delimiter (e.g. `'` or `"`). */
  quotes: string[];
  /** Start marker; the comment runs to end of line (or EOF). */
  lineComments: string[];
  /** Start/end pair; may span multiple lines. */
  blockComments?: { start: string; end: string }[];
  /**
   * Strings may span lines, use `\` escapes, and an unterminated one covers the rest of
   * its opening line - the PL/I host lexer's string semantics (`STRING_TERM`). Set on the
   * delimiters used for walks over *host* text; an engine's own `Delimiters` describe the
   * embedded language, whose strings all end at a line break.
   */
  multilineStrings?: boolean;
}

/**
 * If a quoted string, line comment, or block comment starts exactly at `text[from]`, returns
 * the offset right after it ends; otherwise `undefined`. If unterminated, runs until the end of the line.
 */
function skipDelimited(
  text: string,
  from: number,
  delimiters: Delimiters,
): number | undefined {
  const ch = text[from];
  if (delimiters.quotes.includes(ch)) {
    let i = from + 1;
    while (i < text.length) {
      const current = text[i];
      if (current === ch) {
        if (text[i + 1] === ch) {
          i += 2; // doubled-quote escape (`''`/`""`) - still inside the string
          continue;
        }
        return i + 1; // closing quote
      }
      if (delimiters.multilineStrings) {
        if (current === "\\") {
          i += 2; // backslash escape, like the host lexer's `STRING_TERM`
          continue;
        }
      } else if (current === "\n" || current === "\r") {
        return i; // unterminated - stop at the line break, matching the embedded grammars
      }
      i++;
    }
    if (delimiters.multilineStrings) {
      // No closing quote before EOF: the host treats the rest of the opening line as the
      // string (see the language package's `stripComments`), so resume on the next line.
      const lineEnd = text.indexOf("\n", from);
      return lineEnd === -1 ? text.length : lineEnd;
    }
    return i; // unterminated - stop at EOF
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

/** A character that can be part of a PL/I identifier (`#`, `@` and `$` on top of `\w`). */
const IDENTIFIER_CHAR = "[A-Za-z0-9_#@$]";

/** What one {@link scanHostText} walk found. */
export interface HostScanResult {
  /** The scanned prefix's own `EXEC` statements, in text order. */
  fragments: ExecFragment[];
  /**
   * Start offsets of every match of the caller's secondary anchor (outside strings and
   * outside *every* `EXEC` statement, whatever its prefix), in text order.
   */
  anchors: number[];
}

/**
 * One linear, quote-aware walk over host text to find pieces of preprocessor text within the text.
 * Circumvents the need for a full lexing of the input text by looking for specific anchors.
 */
export function scanHostText(
  text: string,
  prefix: string,
  delimiters: Delimiters,
  anchor?: RegExp,
): HostScanResult {
  const result: HostScanResult = { fragments: [], anchors: [] };
  const upperPrefix = prefix.toUpperCase();
  const hostDelimiters: Delimiters = {
    quotes: delimiters.quotes,
    lineComments: [],
    multilineStrings: true,
  };
  const pattern = new RegExp(
    String.raw`(?<!${IDENTIFIER_CHAR})(?:(EXEC)\s+(\w+)\s*` +
      (anchor ? `|(${anchor.source})` : "") +
      ")",
    "iy",
  );
  let i = 0;
  while (i < text.length) {
    const skipTo = skipDelimited(text, i, hostDelimiters);
    if (skipTo !== undefined) {
      i = skipTo;
      continue;
    }
    pattern.lastIndex = i;
    const match = pattern.exec(text);
    if (!match) {
      i++;
      continue;
    }
    if (match[1]) {
      const own = match[2].toUpperCase() === upperPrefix;
      const bodyStart = i + match[0].length;
      const semicolon = findTerminator(
        text,
        bodyStart,
        own ? delimiters : hostDelimiters,
      );
      if (own) {
        result.fragments.push(
          semicolon !== undefined
            ? {
                range: { start: i, end: semicolon + 1 },
                bodyText: text.slice(bodyStart, semicolon),
                bodyOffset: bodyStart,
                terminated: true,
              }
            : {
                range: { start: i, end: text.length },
                bodyText: text.slice(bodyStart),
                bodyOffset: bodyStart,
                terminated: false,
              },
        );
      }
      if (semicolon === undefined) {
        break;
      }
      i = semicolon + 1;
      continue;
    }
    result.anchors.push(i);
    i += Math.max(1, match[0].length);
  }
  return result;
}

/**
 * Scans `text` for every `EXEC <prefix> ...;` statement. Used by tests.
 */
export function scanExecFragments(
  text: string,
  prefix: string,
  delimiters: Delimiters,
): ExecFragment[] {
  return scanHostText(text, prefix, delimiters).fragments;
}
