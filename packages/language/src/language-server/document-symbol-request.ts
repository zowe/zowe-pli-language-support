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
import { isValidToken } from "../linking/tokens";
import { DocumentSymbol, Range } from "./types";

export function documentSymbolRequest(
  uri: URI,
  compilationUnit: CompilationUnit,
): DocumentSymbol[] {
  // Find all tokens that carry payload and while we are at it,
  // collect all related elements.
  const documentSymbols: DocumentSymbol[] = [];
  const tokensByElement = new Map<SyntaxNode, Token[]>();
  const fileTokens = compilationUnit.services.files.getTokens(uri);
  if (!fileTokens) {
    // No tokens found for ${textDocument.uri} in the current compilation unit.
    return [];
  }

  // First pass: find the tokens a builder can actually turn into a symbol,
  // and remember their elements. Only those elements need a token index -
  // indexing everything beyond that is quite expensive and unnecessary.
  type Builder = (typeof DOCUMENT_SYMBOL_BUILDERS)[number];
  const handledTokens: { token: Token; builder: Builder }[] = [];
  const usedElements = new Set<SyntaxNode>();
  for (const token of fileTokens) {
    if (!token.element || !isValidToken(token)) {
      continue;
    }
    const builder = DOCUMENT_SYMBOL_BUILDERS.find((b) => b.canHandle(token));
    if (builder) {
      handledTokens.push({ token, builder });
      usedElements.add(token.element);
    }
  }

  // Second pass: collect the tokens of just those elements.
  for (const token of fileTokens) {
    const element = token.element;
    if (!element || !usedElements.has(element) || !isValidToken(token)) {
      continue;
    }
    let elementTokens = tokensByElement.get(element);
    if (!elementTokens) {
      tokensByElement.set(element, (elementTokens = []));
    }
    elementTokens.push(token);
  }

  let hierarchy: DocumentSymbol[] = [];
  for (const { token, builder } of handledTokens) {
    const symbols = builder.buildSymbols(
      token,
      tokensByElement.get(token.element!)!,
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
