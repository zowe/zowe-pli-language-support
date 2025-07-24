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

import { SymbolInformation } from "vscode-languageserver-types";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";
import { documentSymbolRequest } from "./document-symbol-request";
import { DocumentSymbol, rangeToLSP, WorkspaceSymbol } from "./types";
import { TextDocuments } from "./text-documents";

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
  const unitSymbols = unit.files.flatMap((file) =>
    collectSymbolsForDocument(file, unit),
  );

  return unitSymbols.map((symbol) => {
    return SymbolInformation.create(
      symbol.name,
      symbol.kind,
      symbol.range,
      symbol.uri,
    );
  });
}

function collectSymbolsForDocument(
  uri: URI,
  unit: CompilationUnit,
): WorkspaceSymbol[] {
  const uriString = uri.toString();
  const documentSymbols = documentSymbolRequest(uri, unit);
  const textDocument = TextDocuments.get(uriString);
  if (!textDocument) {
    return [];
  }
  return documentSymbols.flatMap((symbol) => {
    const symbols: WorkspaceSymbol[] = [];

    function collectSymbols(symbol: DocumentSymbol) {
      const range = rangeToLSP(textDocument!, symbol.selectionRange);
      symbols.push({
        kind: symbol.kind,
        name: symbol.name,
        range,
        uri: uriString,
      });
      if (symbol.children) {
        symbol.children.forEach(collectSymbols);
      }
    }
    collectSymbols(symbol);
    return symbols;
  });
}
