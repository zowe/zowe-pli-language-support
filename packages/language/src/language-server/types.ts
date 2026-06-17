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
import { InsertTextFormat, MarkupContent } from "vscode-languageserver-types";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  ParametricPLICode,
  PLICode,
  SimplePLICode,
} from "../validation/pli-codes";

export type Offset = number;

export interface Location {
  uri: string;
  range: Range;
  source?: Range;
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
  return token.uri?.toString();
}

export function tokenToRange(token: Token): Range {
  return offsetLengthToRange(
    token.startOffset,
    token.endOffset - token.startOffset + 1,
  );
}

export function offsetLengthToRange(offset: number, length: number): Range {
  const safeOffset = Math.max(0, offset);
  const safeLength = Math.max(1, length);
  return {
    start: safeOffset,
    end: safeOffset + safeLength,
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
  uri?: string;
  range?: Range;
  message: string;
  code?: string;
  data?: any;
  source?: string;
}

export function isDiagnostic(obj: any): obj is Diagnostic {
  return (
    obj &&
    typeof obj === "object" &&
    "message" in obj &&
    typeof obj.message === "string" &&
    "severity" in obj &&
    typeof obj.severity === "number"
  );
}

export function fullCode(code: PLICode): string {
  return `${code.code}${Severity[code.severity]}`;
}

export function diagnosticFromCode(
  code: SimplePLICode,
  token: Token | null | undefined,
): Diagnostic;
export function diagnosticFromCode<Code extends ParametricPLICode>(
  code: Code,
  token: Token | null | undefined,
  ...args: Parameters<Code["message"]>
): Diagnostic;
export function diagnosticFromCode(
  code: SimplePLICode | ParametricPLICode,
  token: Token | null | undefined,
  ...args: unknown[]
): Diagnostic {
  let uri: string | undefined = undefined;
  let range: Range | undefined = undefined;
  if (token) {
    uri = tokenToUri(token);
    range = tokenToRange(token);
  }
  let message = code.message;
  if (typeof message === "string") {
    // Simple message, no parameters
    return {
      severity: code.severity,
      uri,
      range,
      message,
      code: fullCode(code),
    };
  } else {
    // Parametric message, format with args
    return {
      severity: code.severity,
      uri,
      range,
      message: message(...args),
      code: fullCode(code),
    };
  }
}

export function diagnosticFromCodeAtRange(
  code: SimplePLICode,
  uri: string | null | undefined,
  range: Range,
): Diagnostic;
export function diagnosticFromCodeAtRange<Code extends ParametricPLICode>(
  code: Code,
  uri: string | null | undefined,
  range: Range,
  ...args: Parameters<Code["message"]>
): Diagnostic;
export function diagnosticFromCodeAtRange(
  code: SimplePLICode | ParametricPLICode,
  uri: string | null | undefined,
  range: Range,
  ...args: unknown[]
): Diagnostic {
  const message =
    typeof code.message === "string" ? code.message : code.message(...args);
  return {
    severity: code.severity,
    range,
    message,
    uri: uri ?? undefined,
    code: fullCode(code),
  };
}

export function diagnostic(
  severity: Severity,
  message: string,
  token: Token | null | undefined,
): Diagnostic;
export function diagnostic(
  severity: Severity,
  message: string,
  range: Range | null | undefined,
  uri: string | null | undefined,
): Diagnostic;
export function diagnostic(
  severity: Severity,
  message: string,
  token: Token | null | Range | undefined,
  uri?: string | null,
): Diagnostic {
  let range: Range | undefined = undefined;
  if (token) {
    if ("image" in token) {
      uri = tokenToUri(token);
      range = tokenToRange(token);
    } else {
      range = token;
    }
  }
  return {
    severity,
    uri: uri ?? undefined,
    range,
    message,
  };
}

export function diagnosticsToLSP(
  unit: CompilationUnit,
  diagnostics: Diagnostic[],
): Map<string, lsp.Diagnostic[]> {
  const map = new Map<string, lsp.Diagnostic[]>();
  for (const diagnostic of diagnostics) {
    const uri = diagnostic.uri;
    const lspDiagnostic = diagnosticToLSP(unit, diagnostic);
    if (!lspDiagnostic || !uri) {
      continue;
    }
    if (!map.has(uri)) {
      map.set(uri, []);
    }
    map.get(uri)?.push(lspDiagnostic);
  }
  return map;
}

export const PliLanguageName = "PL/I";

export function diagnosticToLSP(
  unit: CompilationUnit,
  diagnostic: Diagnostic,
): lsp.Diagnostic | undefined {
  if (
    !diagnostic.uri ||
    !diagnostic.range ||
    isNaN(diagnostic.range.start) ||
    isNaN(diagnostic.range.end)
  ) {
    return undefined;
  }
  const doc = unit.services.files.getDocument(diagnostic.uri);
  if (!doc) {
    return undefined;
  }
  return {
    severity: severityToLsp(diagnostic.severity),
    range: {
      start: offsetToPosition(doc, diagnostic.range.start),
      end: offsetToPosition(doc, diagnostic.range.end),
    },
    message: diagnostic.message,
    code: diagnostic.code,
    data: diagnostic.data,
    source: diagnostic.source ?? PliLanguageName,
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
