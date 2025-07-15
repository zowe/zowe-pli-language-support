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

import { DocumentSymbol, SymbolInformation } from "vscode-languageserver-types";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";
import { documentSymbolRequest } from "./document-symbol-request";

export function workspaceSymbolRequest(
  query: string,
  units: CompilationUnit[],
): SymbolInformation[] {
  return units.flatMap((unit) => {
    if (!unit.requestCaches.get("workspaceSymbols")) {
      unit.requestCaches.set(
        "workspaceSymbols",
        workspaceSymbolRequestForCompilationUnit(unit),
      );
    }
    const symbols = unit.requestCaches.get("workspaceSymbols") ?? [];
    return symbols.filter((symbol) =>
      symbol.name.toLowerCase().includes(query.toLowerCase()),
    );
  });
}

export function workspaceSymbolRequestForCompilationUnit(
  unit: CompilationUnit,
): SymbolInformation[] {
  // Get symbols for all files in the compilation unit.
  const unitSymbols = unit.files.flatMap((file) => {
    const symbols = collectSymbolsForDocument(file, unit);
    return symbols.map((symbol) => ({
      symbol,
      uri: file,
    }));
  });

  return unitSymbols.map(({ symbol, uri }) => {
    return SymbolInformation.create(
      symbol.name,
      symbol.kind,
      symbol.selectionRange,
      uri.toString(),
    );
  });
}

function collectSymbolsForDocument(
  uri: URI,
  unit: CompilationUnit,
): DocumentSymbol[] {
  const documentSymbols = documentSymbolRequest(uri, unit);

  return documentSymbols.flatMap((symbol) => {
    const symbols: any[] = [];

    function collectSymbols(symbol: any) {
      symbols.push(symbol);
      if (symbol.children) {
        symbol.children.forEach(collectSymbols);
      }
    }

    collectSymbols(symbol);
    return symbols;
  });
}
