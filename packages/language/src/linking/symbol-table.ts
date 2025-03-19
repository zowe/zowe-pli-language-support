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

import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { SourceFile } from "../workspace/source-file";
import { ReferencesCache } from "./resolver";
import { getReference } from "./tokens";

// TODO: Refactor this symbol table into something that can differentiate between scopes
export class SymbolTable {
    private symbols: Map<string, SyntaxNode> = new Map();

    addSymbol(context: SyntaxNode, name: string, node: SyntaxNode): void {
        this.symbols.set(name, node);
    }

    addVariableSymbol(context: SyntaxNode, name: string, node: SyntaxNode): void {
        this.symbols.set(name, node);
    }

    addLabelSymbol(context: SyntaxNode, name: string, node: SyntaxNode): void {
        this.symbols.set(name, node);
    }

    getSymbol(context: SyntaxNode, name: string): SyntaxNode | undefined {
        return this.symbols.get(name);
    }
}

export function iterateSymbols(sourceFile: SourceFile): void {
    const { symbols, references } = sourceFile;
    iterate(sourceFile.ast, symbols, references);
}

function iterate(node: SyntaxNode, table: SymbolTable, references: ReferencesCache): void {
    fillSymbolTable(node, table);
    const ref = getReference(node);
    if (ref) {
        references.add(ref);
    }
    forEachNode(node, (child) => {
        // Set the parent node on our first iteration through the file
        child.container = node;
        iterate(child, table, references);
    });
}

function fillSymbolTable(node: SyntaxNode, table: SymbolTable): void {
    switch (node.kind) {
        case SyntaxKind.DeclaredVariable:
            table.addVariableSymbol(node, node.name!, node);
            break;
        case SyntaxKind.LabelPrefix:
            table.addLabelSymbol(node, node.name!, node);
            break;
    }
}
