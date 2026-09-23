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
  CompletionItemKind,
  InsertTextFormat,
} from "vscode-languageserver-types";
import {
  CURSOR_MARKER,
  getOptionCompletion,
  getValueAlternatives,
  PLI_OPTION_NAMES,
} from "../../preprocessor/compiler-options/completion-pli";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fuzzyMatch } from "../../utils/fuzzy-matcher";
import { URI } from "../../utils/uri";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { CompletionItem } from "../types";

const PROCESS_KEYWORD_LENGTH = 8; // including [*%]

function escapeSnippetText(text: string): string {
  return text.replace(/[\\$}]/g, "\\$&");
}

function escapeChoiceText(text: string): string {
  return text.replace(/[\\,|]/g, "\\$&");
}

function editItem(
  label: string,
  kind: CompletionItemKind,
  text: string,
  start: number,
  end: number = start,
  sortText?: string,
): CompletionItem {
  const item: CompletionItem = {
    label,
    kind,
    edit: { range: { start, end }, text },
  };
  if (sortText !== undefined) item.sortText = sortText;
  return item;
}

/**
 * Provides completion items when the cursor is in a compiler-options context:
 *
 * - **Case A** - cursor is inside a `*PROCESS` / `%PROCESS` directive and NOT inside a
 *   parameter list: returns the canonical PLI option names filtered by fuzzy match.
 *   Parameter completion is not yet implemented.
 *
 * - **Case B** - cursor is on a fresh line whose only content so far is `*` or `%`
 *   (optionally followed by a partial `PROCESS`): returns `PROCESS` as a single
 *   keyword completion.
 *
 * Returns `[]` when neither case applies, signalling that the caller should fall
 * through to the normal PLI completion handler.
 */
export function compilerOptionsCompletionRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): CompletionItem[] {
  // Case A: cursor inside a known PROCESS directive region
  for (const range of unit.compilerOptions.ranges) {
    if (offset > range.start + PROCESS_KEYWORD_LENGTH && offset <= range.end) {
      return getOptionNameCompletions(unit, uri, range, offset);
    }
  }

  // Case B: cursor after * / % at the start of a line (PROCESS keyword itself)
  return getProcessKeywordCompletion(unit, uri, offset);
}

function getOptionNameCompletions(
  unit: CompilationUnit,
  uri: URI,
  range: { start: number; end: number },
  offset: number,
): CompletionItem[] {
  const doc = unit.services.files.getDocument(uri);
  if (!doc) {
    return [];
  }

  const optionsOffset = range.start + PROCESS_KEYWORD_LENGTH;

  // Fetch only the directive slice from after *PROCESS up to the cursor.
  const directiveText = doc.getText({
    start: doc.positionAt(optionsOffset),
    end: doc.positionAt(offset),
  });

  const analysis = analyzeDirectiveText(directiveText);
  if (!analysis) {
    // The cursor is inside an open parameter list. Only options with fixed
    // literal alternatives support completion here.
    return getParamAlternativeCompletions(
      doc,
      directiveText,
      optionsOffset,
      offset,
    );
  }

  const { query, immediateChar, prevNonWs } = analysis;
  // A separator is needed only when the cursor is immediately adjacent to ')'
  // with no intervening space or comma. A space is already a valid separator.
  const needsSeparator = query === "" && immediateChar === ")";
  const queryStart = optionsOffset + directiveText.length - query.length;

  const items: CompletionItem[] = PLI_OPTION_NAMES.filter((name) =>
    fuzzyMatch(query, name),
  ).map((name): CompletionItem => {
    const meta = getOptionCompletion(name);
    let baseText: string;
    let detail: string | undefined;
    let insertTextFormat: InsertTextFormat | undefined;

    const params = meta?.params;

    if (meta && meta.mandatoryParams > 0 && params && params.length > 1) {
      // Mandatory parameter with at least two candidate values: offer a single LSP snippet "choice".
      const choices = params.map(escapeChoiceText).join(",");
      baseText = `${name}(\${1|${choices}|})`;
      detail = `(${params.join("|")})`;
      insertTextFormat = InsertTextFormat.Snippet;
    } else if (meta && meta.mandatoryParams > 0) {
      // A single or no candidate value: use it as the snippet's tab-stop
      // default, honoring a cursor marker if present.
      const singleParam = params?.[0];
      if (singleParam !== undefined && singleParam.includes(CURSOR_MARKER)) {
        const [before, after] = singleParam.split(CURSOR_MARKER);
        baseText = `${name}(${escapeSnippetText(before)}$0${escapeSnippetText(after)})`;
        detail = `(${before}${after})`;
      } else {
        baseText = `${name}(\${1:${singleParam ?? ""}})`;
        detail = singleParam !== undefined ? `(${singleParam})` : "(...)";
      }
      insertTextFormat = InsertTextFormat.Snippet;
    } else {
      baseText = name;
    }

    const insertText = needsSeparator ? `, ${baseText}` : baseText;

    const item: CompletionItem = {
      label: name,
      kind: CompletionItemKind.Keyword,
      edit: {
        range: { start: queryStart, end: offset },
        text: insertText,
      },
    };
    if (detail !== undefined) item.detail = detail;
    if (insertTextFormat !== undefined)
      item.insertTextFormat = insertTextFormat;
    // When the insert text is prefixed with ', ', set filterText to the bare
    // name so the LSP client can still filter by what the user types.
    if (needsSeparator) item.filterText = name;
    return item;
  });

  // Offer ';' as a directive terminator when no partial name is being typed,
  // unless one is already present right after the cursor.
  const nextChar = doc.getText({
    start: doc.positionAt(offset),
    end: doc.positionAt(offset + 1),
  });
  if (
    query === "" &&
    prevNonWs !== "," &&
    !(needsSeparator && nextChar === ";")
  ) {
    items.unshift(
      editItem(";", CompletionItemKind.Operator, ";", offset, offset, " "),
    );
  }

  // When a full option name that only offers optional parameter alternatives
  // has just been typed, let the user go straight to `NAME;` or `NAME(alternative)` in one shot.
  const nextStepItems = getNextStepItems(query, prevNonWs, offset);
  return nextStepItems ?? items;
}

function getNextStepItems(
  query: string,
  prevNonWs: string,
  offset: number,
): CompletionItem[] | undefined {
  if (query === "") return undefined;
  const meta = getOptionCompletion(query);
  const alternatives = meta ? getValueAlternatives(meta) : undefined;
  if (
    !meta ||
    meta.name !== query.toUpperCase() ||
    meta.mandatoryParams !== 0 ||
    !alternatives?.length
  ) {
    return undefined;
  }

  const items: CompletionItem[] = [];
  if (prevNonWs !== ",") {
    items.push(
      editItem(";", CompletionItemKind.Operator, ";", offset, offset, " "),
    );
  }
  for (const alternative of alternatives) {
    items.push(
      editItem(
        `(${alternative})`,
        CompletionItemKind.Value,
        `(${alternative})`,
        offset,
        offset,
        "  ",
      ),
    );
  }
  return items;
}

/**
 * Offers completion for the value inside an option's parentheses when that
 * option only has a fixed set of literal alternatives (e.g. `AGGREGATE(<|>)`
 * offers `DECIMAL` / `HEXADEC`). Returns `[]` when the cursor is not inside such a parameter list.
 */
function getParamAlternativeCompletions(
  doc: TextDocument,
  directiveText: string,
  optionsOffset: number,
  offset: number,
): CompletionItem[] {
  const ctx = findEnclosingParamContext(directiveText);
  if (!ctx) {
    return [];
  }

  const meta = getOptionCompletion(ctx.name);
  const alternatives = meta ? getValueAlternatives(meta) : undefined;
  if (!alternatives || alternatives.length === 0) {
    return [];
  }

  // Once a full, exact alternative has been typed, the (single) parameter is
  // complete: offer ONLY ways to close the parentheses and terminate the
  // directive.
  const isCompleteValue = alternatives.some(
    (alternative) => alternative.toUpperCase() === ctx.paramText.toUpperCase(),
  );
  if (isCompleteValue) {
    const nextChar = doc.getText({
      start: doc.positionAt(offset),
      end: doc.positionAt(offset + 1),
    });
    if (nextChar === ")") {
      // The closing paren already exists: the directive is already
      // structurally complete, so there's nothing left to suggest.
      return [];
    }
    // No closing paren yet: offer both a bare ')' and ');'.
    return [
      editItem(")", CompletionItemKind.Operator, ")", offset, offset, " "),
      editItem(");", CompletionItemKind.Operator, ");", offset, offset, "  "),
    ];
  }

  const paramStart = optionsOffset + ctx.paramStartIndex;
  return alternatives
    .filter((alternative) => fuzzyMatch(ctx.paramText, alternative))
    .map((alternative) =>
      editItem(
        alternative,
        CompletionItemKind.Value,
        alternative,
        paramStart,
        offset,
      ),
    );
}

/**
 * Scans `text` character by character, skipping over string literals
 * and comments, and invoking `onChar` for every other character.
 * A `\n` that closes a line comment is reported too, since it still acts
 * as a token separator.
 *
 * Returns `true` if the scan ended inside an unterminated string, line
 * comment, or block comment.
 */
function scanCode(
  text: string,
  onChar: (ch: string, index: number) => void,
): boolean {
  let stringChar = "";
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        onChar(ch, i);
      }
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && text[i + 1] === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (stringChar) {
      if (ch === stringChar) {
        if (text[i + 1] === stringChar) i++;
        else stringChar = "";
      }
      continue;
    }
    if (ch === "/" && text[i + 1] === "/") {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && text[i + 1] === "*") {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === "'" || ch === '"') {
      stringChar = ch;
      continue;
    }

    onChar(ch, i);
  }

  return !(inLineComment || inBlockComment || stringChar !== "");
}

/**
 * Scans `text` to find the option name and partial parameter text for the
 * innermost parenthesised group directly enclosing the cursor
 * Returns `null` for top-level cursors, nested parens, or when
 * inside a string/comment.
 */
function findEnclosingParamContext(
  text: string,
): { name: string; paramStartIndex: number; paramText: string } | null {
  let parenDepth = 0;
  let currentIdentifier = "";
  let paramStartIndex = -1;
  let enclosingName = "";

  scanCode(text, (ch, i) => {
    if (parenDepth === 0) {
      if (ch === "(") {
        enclosingName = currentIdentifier.toUpperCase();
        currentIdentifier = "";
        parenDepth = 1;
        paramStartIndex = i + 1;
      } else if (/[A-Za-z0-9_]/.test(ch)) {
        currentIdentifier += ch;
      } else {
        currentIdentifier = "";
      }
    } else if (ch === "(") {
      parenDepth++;
    } else if (ch === ")") {
      parenDepth--;
      if (parenDepth === 0) {
        paramStartIndex = -1;
        enclosingName = "";
      }
    }
  });

  if (parenDepth !== 1 || paramStartIndex < 0) {
    return null;
  }

  return {
    name: enclosingName,
    paramStartIndex,
    paramText: text.slice(paramStartIndex),
  };
}

const IS_WHITESPACE = new Set([" ", "\t", "\n", "\r"]);
const IS_DELIMITER = new Set([",", ")", ...IS_WHITESPACE]); // Characters that terminate the partial option name being typed.

/**
 * Analyses the directive text (from after `*PROCESS` up to the cursor) to
 * determine the completion context.
 *
 * Returns `null` when option-name completion is not applicable, i.e. when the
 * cursor is inside an open parameter list (paren depth > 0), inside a block
 * or line comment, or inside a string literal.
 *
 * Otherwise returns:
 *  - `query`        - the partial option name being typed at the cursor
 *  - `immediateChar`- the character sitting directly before the query (used to
 *                     detect a cursor that is flush against a closing `)`)
 *  - `prevNonWs`    - the last non-whitespace character before the query (used
 *                     to suppress a `;` offer after a dangling `,`)
 */
function analyzeDirectiveText(text: string): {
  query: string;
  immediateChar: string;
  prevNonWs: string;
} | null {
  let parenDepth = 0;
  let query = "";
  let immediateChar = "";
  let prevNonWs = "";
  let lastNonWs = ""; // last non-whitespace top-level char seen so far

  const wellFormed = scanCode(text, (ch) => {
    if (ch === "(") parenDepth++;
    else if (ch === ")") parenDepth--;

    if (IS_DELIMITER.has(ch)) {
      immediateChar = ch;
      prevNonWs = IS_WHITESPACE.has(ch) ? lastNonWs : ch;
      query = "";
    } else {
      query += ch;
    }
    if (!IS_WHITESPACE.has(ch)) lastNonWs = ch;
  });

  // Cursor is inside an open paren, a comment, or an unterminated string -> no completion
  if (parenDepth > 0 || !wellFormed) {
    return null;
  }

  return { query, immediateChar, prevNonWs };
}

function getProcessKeywordCompletion(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): CompletionItem[] {
  const doc = unit.services.files.getDocument(uri);
  if (!doc) {
    return [];
  }

  const pos = doc.positionAt(offset);

  if (pos.character > PROCESS_KEYWORD_LENGTH) {
    return [];
  }

  if (pos.character === 0) {
    // Cursor is at column 0 with nothing typed yet. Offer *PROCESS / %PROCESS
    // as long as we are still in the compiler-options preamble (before the first
    // PL/I token).
    const tokens = unit.services.files.getTokens(uri);
    if (tokens && tokens.length > 0 && offset >= tokens[0].startOffset) {
      return [];
    }
    return [
      editItem("*PROCESS", CompletionItemKind.Keyword, "*PROCESS", offset),
      editItem("%PROCESS", CompletionItemKind.Keyword, "%PROCESS", offset),
    ];
  }

  const lineUpToCursor = doc.getText({
    start: { line: pos.line, character: 0 },
    end: pos,
  });

  const marker = lineUpToCursor[0];
  const partial = lineUpToCursor.slice(1).toUpperCase();
  if ((marker !== "*" && marker !== "%") || !"PROCESS".startsWith(partial)) {
    return [];
  }

  // Edit range: from right after the [*%] character to the cursor, replacing
  // any partially typed "PROCESS" text.
  const editStart = doc.offsetAt({ line: pos.line, character: 1 });

  return [
    editItem(
      "PROCESS",
      CompletionItemKind.Keyword,
      "PROCESS",
      editStart,
      offset,
    ),
  ];
}
