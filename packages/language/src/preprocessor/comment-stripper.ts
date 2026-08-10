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

import {
  createTokenInstance,
  ML_COMMENT,
  SL_COMMENT,
  STRING_TERM,
  Token,
} from "../parser/tokens";
import { URI } from "../utils/uri";

export interface CommentRange {
  startOffset: number;
  /** Inclusive - the last content character. A trailing newline, if any, is not included. */
  endOffset: number;
}

export interface StripCommentsResult {
  text: string;
  comments: CommentRange[];
}

const SLASH = "/".charCodeAt(0);
const STAR = "*".charCodeAt(0);
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const CARRIAGE_RETURN = "\r".charCodeAt(0);
const LINE_FEED = "\n".charCodeAt(0);

// Clone the lexer's pattern instead of aliasing it: sticky regexes carry mutable
// `lastIndex` state, and sharing one instance with the tokenizer would let the two
// corrupt each other's scans. The algorithm below depends on the sticky flag (an
// `exec` may only match exactly at `lastIndex`, never later), so assert it.
const lexerStringPattern = STRING_TERM.PATTERN as RegExp;
if (!lexerStringPattern.sticky) {
  throw new Error("STRING_TERM pattern is expected to be sticky (y flag)");
}
const stringRegex = new RegExp(
  lexerStringPattern.source,
  lexerStringPattern.flags,
);

/**
 * Blanks every `/ *  ... * /`-style block comment and `//...` line comment in `text` to
 * whitespace, preserving every other character's offset - mirrors `PliMarginsProcessor`'s
 * length-preserving blanking, so the result can still be sliced/indexed with the original
 * offsets everywhere downstream.
 *
 * This exists so external SQL/CICS preprocessors - which scan the *full text* of an `EXEC`
 * fragment rather than tokens - never see comment characters embedded in `EXEC` code (a
 * comment could contain unbalanced quotes or a stray `EXEC SQL`-looking substring). It runs
 * once, on the margin-stripped *original* source text, before any preprocessor phase runs.
 *
 * String literals are skipped whole (reusing the real tokenizer's own `STRING_TERM` pattern)
 * so a comment-looking sequence inside a string is never mistaken for a real comment.
 * Single left-to-right pass, linear in the length of `text` (tokenize hot path).
 */
export function stripComments(text: string): StripCommentsResult {
  const comments: CommentRange[] = [];
  const chunks: string[] = [];
  let cursor = 0;
  let i = 0;

  while (i < text.length) {
    const code = text.charCodeAt(i);

    if (code === SINGLE_QUOTE || code === DOUBLE_QUOTE) {
      stringRegex.lastIndex = i;
      // Sticky regex: a match, if any, starts exactly at `i` (asserted above).
      const match = stringRegex.exec(text);
      if (match && match[0].length > 0) {
        i += match[0].length;
        continue;
      }
      // Unterminated string literal: treat the rest of the line as string
      // content, so a `/*` or `//` inside it is never blanked as a comment.
      // The real tokenizer reports the error on the same (unmodified) text.
      while (i < text.length && text.charCodeAt(i) !== LINE_FEED) {
        i++;
      }
      continue;
    }

    if (code === SLASH && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next === STAR || next === SLASH) {
        const start = i;
        const end =
          next === STAR
            ? findBlockCommentEnd(text, i + 2)
            : findLineCommentEnd(text, i + 2);
        comments.push({ startOffset: start, endOffset: end - 1 });
        chunks.push(text.slice(cursor, start));
        chunks.push(blank(text, start, end));
        cursor = end;
        i = end;
        continue;
      }
    }

    i++;
  }

  chunks.push(text.slice(cursor));
  return { text: chunks.join(""), comments };
}

/**
 * Converts `stripComments`' plain ranges into `Token`s for LSP registration purposes
 * (`files.set`'s `comments`). `text` must be the *pre-strip* text - the stripped text has
 * every comment already blanked to whitespace.
 */
export function commentRangesToTokens(
  ranges: CommentRange[],
  text: string,
  uri: URI,
): Token[] {
  return ranges.map((range) => {
    const image = text.slice(range.startOffset, range.endOffset + 1);
    // `//` line comments get their own token type; everything else is a block comment.
    const isLineComment = image.charCodeAt(1) === SLASH;
    return createTokenInstance(
      image,
      image,
      isLineComment ? SL_COMMENT : ML_COMMENT,
      range.startOffset,
      range.endOffset,
      uri,
    );
  });
}

/** Returns the offset right after the closing `*​/`, or `text.length` if unterminated. */
function findBlockCommentEnd(text: string, from: number): number {
  let j = from;
  while (j < text.length) {
    if (text.charCodeAt(j) === STAR && text.charCodeAt(j + 1) === SLASH) {
      return j + 2;
    }
    j++;
  }
  return text.length;
}

/** Returns the offset of (not including) the line's `\n`, or `text.length` at EOF. */
function findLineCommentEnd(text: string, from: number): number {
  let j = from;
  while (j < text.length && text.charCodeAt(j) !== LINE_FEED) {
    j++;
  }
  if (j > from && text.charCodeAt(j - 1) === CARRIAGE_RETURN) {
    return j - 1;
  }
  return j;
}

/** Replaces `text[start, end)` with spaces, except newline characters, which are kept as-is. */
function blank(text: string, start: number, end: number): string {
  return text
    .slice(start, end)
    .replace(/[^\n\r]+/g, (m) => " ".repeat(m.length));
}
