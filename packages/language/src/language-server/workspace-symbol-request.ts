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
import {
  CompilationUnit,
  CompletionUnitHandler,
} from "../workspace/compilation-unit";

export function workspaceSymbolRequestForCompilationUnit(
  handler: CompletionUnitHandler,
  unit: CompilationUnit,
): SymbolInformation[] {
  // Get symbols for this unit and flatten the hierarchy
  const unitSymbols = handler.getDocumentSymbols(unit.uri).flatMap((symbol) => {
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

  return unitSymbols.map((symbol) => {
    return SymbolInformation.create(
      symbol.name,
      symbol.kind,
      symbol.range,
      unit.uri.toString(),
    );
  });
}
