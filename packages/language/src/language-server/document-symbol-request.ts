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

import { DocumentSymbol, Range, SymbolKind } from "vscode-languageserver-types";
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { TextDocuments } from "./text-documents";
import { SyntaxNode } from "../syntax-tree/ast";
import { DOCUMENT_SYMBOL_BUILDERS } from "./document-symbol-builder";
import { IToken } from "chevrotain";

export function documentSymbolRequest(
  uri: URI,
  compilationUnit: CompilationUnit,
): DocumentSymbol[] {
  const textDocument = TextDocuments.get(uri.toString());
  if (!textDocument) {
    return [];
  }

  // Find all tokens that carry payload and while we are at it,
  // collect all related elements.
  const documentSymbols: DocumentSymbol[] = [];
  const tokensByElement = new Map<SyntaxNode, IToken[]>();
  const tokens = compilationUnit.tokens.fileTokens[textDocument.uri]
    .filter((token) => token.payload?.element)
    .map((token) => {
      const element = token.payload.element;
      if (!tokensByElement.has(element)) {
        tokensByElement.set(element, []);
      }
      tokensByElement.get(element)?.push(token);
      return token;
    });

  let hierarchy: DocumentSymbol[] = [];
  for (const token of tokens) {
    const builder = DOCUMENT_SYMBOL_BUILDERS.find((b) => b.canHandle(token));
    if (!builder) continue;

    const symbols = builder.buildSymbols(
      token,
      tokensByElement.get(token.payload.element)!,
      textDocument,
      [],
    );

    // Process each symbol and update hierarchy
    for (const symbol of symbols) {
      const parent = hierarchy.find((parent) =>
        includes(parent.range, symbol.range),
      );

      if (parent) {
        parent.children!.push(symbol);
      } else {
        documentSymbols.push(symbol);
        // Clear hierarchy when encountering a function outside any parent
        if (symbol.kind === SymbolKind.Function) {
          hierarchy = [];
        }
      }
    }

    // Update hierarchy with functions in reverse order
    const functionSymbols = symbols.filter(
      (symbol) => symbol.kind === SymbolKind.Function,
    );
    hierarchy.unshift(...functionSymbols);
  }

  return documentSymbols;
}

function includes(parentRange: Range, childRange: Range): boolean {
  return (
    (parentRange.start.line <= childRange.start.line ||
      (parentRange.start.line === childRange.start.line &&
        parentRange.start.character <= childRange.start.character)) &&
    (parentRange.end.line >= childRange.end.line ||
      (parentRange.end.line === childRange.end.line &&
        parentRange.end.character >= childRange.end.character))
  );
}
