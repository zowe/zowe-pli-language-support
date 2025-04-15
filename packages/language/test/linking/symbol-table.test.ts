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

import { describe, expect, test } from "vitest";
import { formatPLICode, lifecycleDebug } from "../utils";
import { SyntaxKind, SyntaxNode } from "../../src/syntax-tree/ast";
import { forEachNode } from "../../src/syntax-tree/ast-iterator";
import { IToken } from "@chevrotain/types";
import { pliPrograms } from "../pli-programs";
import { pliDocPrograms } from "../pli-doc-programs";
import { IntermediateBinaryExpression } from "../../src/parser/abstract-parser";

function isIntermediateBinaryExpression(
  node: any,
): node is IntermediateBinaryExpression {
  return node && "infix" in node && "items" in node && "operators" in node;
}

function attachDebugInfo<T extends { kind: SyntaxKind }>(node: T): T {
  Object.defineProperty(node, "kindName", {
    get: () => SyntaxKind[node.kind],
    enumerable: true,
    configurable: true,
  });
  return node;
}

function expectSymbolTable(code: string) {
  const pli = formatPLICode(code);
  const doc = lifecycleDebug(pli, attachDebugInfo);

  const tokens = doc.tokens.all;
  for (const token of tokens) {
    expect(token.payload).toBeDefined();

    if (token.payload.kind === -1) {
      // FQN rule does not reset the token kind.
      // todo: Remove this exception once the FQN rule is updated.
      continue;
    }
    if (isIntermediateBinaryExpression(token.payload.element)) {
      // Not an AST node
      continue;
    }

    expect(
      token.payload.element,
      `Token of kind ${token.payload.kind} (${token.image}) should have a defined element`,
    ).toBeDefined();
    expect(
      token.payload.element,
      `Token of kind ${token.payload.kind} (${token.image}) should have a non-null element`,
    ).not.toBeNull();
    expectASTNodeContainer(token.payload.element, token);
  }
}

function expectASTNodeContainer(node: SyntaxNode, originalToken: IToken) {
  expect(
    (node as any).kindName,
    `Node of kind ${node.kind} (${originalToken.image}) was not reached by the ast iterator`,
  ).toBeDefined();
  expect(
    node.container,
    `Node of kind ${node.kind} (${originalToken.image}) should have a defined container`,
  ).toBeDefined();
  expect(
    node.container,
    `Node of kind ${node.kind} (${originalToken.image}) should have a non-null container`,
  ).not.toBeNull();

  forEachNode(node as SyntaxNode, (childNode: SyntaxNode) => {
    expectASTNodeContainer(childNode, originalToken);
  });
}

describe("Symbol Table PLI programs", () => {
  for (const [index, program] of pliPrograms.entries()) {
    test(`should create valid symbol table for program ${index}`, () => {
      expectSymbolTable(program);
    });
  }
});

describe("Symbol Table PLI-DOC programs", () => {
  for (const [index, program] of pliDocPrograms.entries()) {
    test(`should create valid symbol table for program ${index}`, () => {
      expectSymbolTable(program);
    });
  }
});
