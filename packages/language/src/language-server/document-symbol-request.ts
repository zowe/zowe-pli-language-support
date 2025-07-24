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

import { SymbolKind } from "vscode-languageserver-types";
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { SyntaxNode } from "../syntax-tree/ast";
import { DOCUMENT_SYMBOL_BUILDERS } from "./document-symbol-builder";
import { Token } from "../parser/tokens";
import { TextDocuments } from "./text-documents";
import { isValidToken } from "../linking/tokens";
import { DocumentSymbol, Range } from "./types";

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
  const tokensByElement = new Map<SyntaxNode, Token[]>();
  const fileTokens = compilationUnit.tokens.fileTokens.get(textDocument.uri);
  if (!fileTokens) {
    // No tokens found for ${textDocument.uri} in the current compilation unit.
    return [];
  }

  const tokens = fileTokens
    .filter((token) => token.payload.element && isValidToken(token))
    .map((token) => {
      const element = token.payload.element!;
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
      tokensByElement.get(token.payload.element!)!,
      [],
    );

    // Process each symbol and update hierarchy
    for (const symbol of symbols) {
      const parent = hierarchy.find((parent) =>
        includes(parent.range, symbol.range),
      );

      if (parent) {
        parent.children ??= [];
        parent.children.push(symbol);
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
    parentRange.start <= childRange.start && parentRange.end >= childRange.end
  );
}
