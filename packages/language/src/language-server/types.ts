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

import { TextDocument } from "vscode-languageserver-textdocument";
import * as lsp from "vscode-languageserver-types";
import { getNameToken } from "../linking/tokens";
import { SyntaxNode } from "../syntax-tree/ast";
import { Token } from "../parser/tokens";
import { TextDocuments } from "./text-documents";
import { InsertTextFormat, MarkupContent } from "vscode-languageserver-types";

export type Offset = number;

export interface Location {
  uri: string;
  range: Range;
}

export interface Range {
  start: number;
  end: number;
}

export function offsetToPosition(
  textDocument: TextDocument,
  offset: Offset,
): lsp.Position {
  const pos = textDocument.positionAt(offset);
  return {
    line: pos.line,
    character: pos.character,
  };
}

export function positionToOffset(
  textDocument: TextDocument,
  position: lsp.Position,
): Offset {
  return textDocument.offsetAt(position);
}

export function rangeToLSP(
  textDocument: TextDocument,
  range: Range,
): lsp.Range {
  return {
    start: offsetToPosition(textDocument, range.start),
    end: offsetToPosition(textDocument, range.end),
  };
}

export function tokenToUri(token: Token): string | undefined {
  return token.payload.uri?.toString();
}

export function tokenToRange(token: Token): Range {
  return {
    start: token.startOffset,
    end: token.endOffset + 1,
  };
}

/**
 * Retrieve the range of the given syntax node, when possible.
 */
export function getSyntaxNodeRange(node: SyntaxNode): Range | undefined {
  const token = getNameToken(node);
  if (token) {
    return tokenToRange(token);
  }
  return undefined;
}

export enum Severity {
  /** Info */
  I,
  /** Warning */
  W,
  /** Error */
  E,
  /** Severe */
  S,
  /** TODO? */
  U,
}

export function severityToLsp(severity: Severity): lsp.DiagnosticSeverity {
  switch (severity) {
    case Severity.I:
      return lsp.DiagnosticSeverity.Information;
    case Severity.W:
      return lsp.DiagnosticSeverity.Warning;
    case Severity.E:
      return lsp.DiagnosticSeverity.Error;
    case Severity.S:
      return lsp.DiagnosticSeverity.Error;
    case Severity.U:
      return lsp.DiagnosticSeverity.Hint;
  }
}

export interface Diagnostic {
  severity: Severity;
  uri: string;
  range: Range;
  message: string;
  code?: string;
  data?: any;
  source?: string;
}

/**
 * DiagnosticInfo is a Diagnostic without the severity and message fields.
 * For convenience w/ prior-langium diagnostic reporting in our validations
 */
export type DiagnosticInfo = Omit<Diagnostic, "severity" | "message">;

export function diagnosticsToLSP(
  diagnostics: Diagnostic[],
): Map<string, lsp.Diagnostic[]> {
  const map = new Map<string, lsp.Diagnostic[]>();
  for (const diagnostic of diagnostics) {
    const uri = diagnostic.uri;
    const lspDiagnostic = diagnosticToLSP(diagnostic);
    if (!map.has(uri)) {
      map.set(uri, []);
    }
    map.get(uri)?.push(lspDiagnostic);
  }
  return map;
}

export function diagnosticToLSP(diagnostic: Diagnostic): lsp.Diagnostic {
  const doc = TextDocuments.get(diagnostic.uri);
  return {
    severity: severityToLsp(diagnostic.severity),
    range: {
      start: doc
        ? offsetToPosition(doc, diagnostic.range.start)
        : {
            character: 0,
            line: 0,
          },
      end: doc
        ? offsetToPosition(doc, diagnostic.range.end)
        : {
            character: 0,
            line: 0,
          },
    },
    message: diagnostic.message,
    code: diagnostic.code,
    data: diagnostic.data,
    source: diagnostic.source ?? "pli",
  };
}

export interface CompletionItem {
  label: string;
  kind: lsp.CompletionItemKind;
  detail?: string;
  documentation?: string;
  sortText?: string;
  filterText?: string;
  edit: TextEdit;
  insertTextFormat?: lsp.InsertTextFormat;
}

export interface SimpleCompletionItem extends Omit<CompletionItem, "edit"> {
  text: string;
}

export function completionItemToLSP(
  textDocument: TextDocument,
  item: CompletionItem,
): lsp.CompletionItem {
  return {
    label: item.label,
    kind: item.kind,
    detail: item.detail,
    documentation: item.documentation,
    sortText: item.sortText,
    filterText: item.filterText,
    textEdit: textEditToLSP(textDocument, item.edit),
    insertTextFormat: item.insertTextFormat ?? InsertTextFormat.PlainText,
  };
}

export interface TextEdit {
  range: Range;
  text: string;
}

export function textEditToLSP(
  textDocument: TextDocument,
  edit: TextEdit,
): lsp.TextEdit {
  return {
    range: rangeToLSP(textDocument, edit.range),
    newText: edit.text,
  };
}

export interface HoverResponse {
  range?: Range;
  contents: MarkupContent;
}

export function hoverResponseToLSP(
  textDocument: TextDocument,
  response: HoverResponse,
): lsp.Hover {
  return {
    range: response.range && rangeToLSP(textDocument, response.range),
    contents: response.contents,
  };
}

export interface DocumentSymbol {
  name: string;
  kind: lsp.SymbolKind;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
}

export function documentSymbolToLSP(
  textDocument: TextDocument,
  symbol: DocumentSymbol,
): lsp.DocumentSymbol {
  let children: lsp.DocumentSymbol[] | undefined = undefined;
  if (symbol.children && symbol.children.length > 0) {
    // Ensure that the children are contained within the symbol's range
    let start = symbol.range.start;
    let end = symbol.range.end;
    children = symbol.children.map((child) => {
      const childSymbol = documentSymbolToLSP(textDocument, child);
      start = Math.min(start, child.range.start);
      end = Math.max(end, child.range.end);
      return childSymbol;
    });
    symbol.range = {
      start,
      end,
    };
  }
  return {
    name: symbol.name,
    kind: symbol.kind,
    range: rangeToLSP(textDocument, symbol.range),
    selectionRange: rangeToLSP(textDocument, symbol.selectionRange),
    children,
  };
}

export interface WorkspaceSymbol {
  name: string;
  kind: lsp.SymbolKind;
  range: lsp.Range;
  uri: string;
}
