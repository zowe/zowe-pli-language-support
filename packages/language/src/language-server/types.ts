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

import { IToken } from "chevrotain";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as lsp from "vscode-languageserver-types";
import { TextDocuments } from "./text-documents";
import { getNameToken } from "../linking/tokens";
import { SyntaxNode } from "../syntax-tree/ast";

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

export function tokenToRange(token: IToken): Range {
  return {
    start: token.startOffset,
    end: token.endOffset! + 1,
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

export function diagnosticToLSP(
  diagnostic: Diagnostic,
): lsp.Diagnostic {
  const doc = TextDocuments.get(diagnostic.uri);
  return {
    severity: severityToLsp(diagnostic.severity),
    range: {
      start: doc ? offsetToPosition(doc, diagnostic.range.start) : {
        character: 0,
        line: 0,
      },
      end: doc ? offsetToPosition(doc, diagnostic.range.end) : {
        character: 0,
        line: 0
      },
    },
    message: diagnostic.message,
    code: diagnostic.code,
    data: diagnostic.data,
    source: diagnostic.source ?? "pli",
  };
}
