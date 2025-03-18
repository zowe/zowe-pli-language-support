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

export function createSymbolTable(node: SyntaxNode): SymbolTable {
    const table = new SymbolTable();
    fillSymbolTable(node, table);
    return table;
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
    iterateSymbolTable(node, (child) => fillSymbolTable(child, table));
}

export function iterateSymbolTable(node: SyntaxNode, action: (node: SyntaxNode) => void): void {
    switch (node.kind) {
        case SyntaxKind.PliProgram:
            node.statements.forEach(action);
            break;
        case SyntaxKind.Package:
            node.statements.forEach(action);
            break;
        case SyntaxKind.Statement:
            node.labels.forEach(action);
            if (node.value) {
                action(node.value);
            }
            break;
        case SyntaxKind.ProcedureStatement:
            node.statements.forEach(action);
            break;
        case SyntaxKind.BeginStatement:
            node.statements.forEach(action);
            break;
        case SyntaxKind.DoStatement:
            node.statements.forEach(action);
            break;
        case SyntaxKind.SelectStatement:
            node.statements.forEach(action);
            break;
        case SyntaxKind.DeclareStatement:
            node.items.forEach(action);
            break;
        case SyntaxKind.DeclaredItem:
            if (node.element && node.element !== '*') {
                action(node.element);
            }
            node.items.forEach(action);
            break;
        case SyntaxKind.DefineStructureStatement:
            node.substructures.forEach(action);
            break;
        case SyntaxKind.DefineOrdinalStatement:
            if (node.ordinalValues) {
                action(node.ordinalValues);
            }
            break;
        case SyntaxKind.OrdinalValueList:
            node.members.forEach(action);
            break;
        case SyntaxKind.DefineAliasStatement:
            node.attributes.forEach(action);
            break;
    }
}