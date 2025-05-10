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
import { CompilationUnit } from "../workspace/compilation-unit";
import { documentSymbolRequest } from "./document-symbol-request";

export function workspaceSymbolRequest(
  compilationUnits: CompilationUnit[],
  query: string,
): SymbolInformation[] {
  return compilationUnits.flatMap((unit) => {
    if (!unit.requestCaches.get("workspaceSymbols").isCached()) {
      unit.requestCaches
        .get("workspaceSymbols")
        .set(compilationUnitWorkspaceSymbols(unit));
    }
    const symbols = unit.requestCaches.get("workspaceSymbols").get() ?? [];
    return symbols.filter((symbol) =>
      symbol.name.toLowerCase().includes(query.toLowerCase()),
    );
  });
}

export function compilationUnitWorkspaceSymbols(
  unit: CompilationUnit,
): SymbolInformation[] {
  // Get symbols for this unit and flatten the hierarchy
  const unitSymbols = documentSymbolRequest(unit, unit.uri).flatMap(
    (symbol) => {
      const symbols: any[] = [];

      function collectSymbols(symbol: any) {
        symbols.push(symbol);
        if (symbol.children) {
          symbol.children.forEach(collectSymbols);
        }
      }

      collectSymbols(symbol);
      return symbols;
    },
  );

  return unitSymbols.map((symbol) => {
    return SymbolInformation.create(
      symbol.name,
      symbol.kind,
      symbol.range,
      unit.uri.toString(),
    );
  });
}
