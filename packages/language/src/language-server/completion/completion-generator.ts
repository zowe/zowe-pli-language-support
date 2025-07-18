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

import { CompletionItemKind } from "vscode-languageserver-types";
import { Statement, SyntaxKind, SyntaxNode } from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { FollowElement, FollowKind } from "./follow-elements";
import { getQualifiedName } from "../../linking/resolver";
import { getCompletionKeywords } from "./keywords";
import { SimpleCompletionItem } from "../types";

export function generateCompletionItems(
  unit: CompilationUnit,
  context: SyntaxNode | undefined,
  followElement: FollowElement,
): SimpleCompletionItem[] {
  const items: SimpleCompletionItem[] = [];

  if (followElement.kind === FollowKind.CstNode) {
    const keywords = followElement.types.flatMap(getCompletionKeywords);
    items.push(...keywords);
  }
  if (followElement.kind === FollowKind.QualifiedReference) {
    context = followElement.previous;
  } else if (!context) {
    return items;
  }
  const scopeCache = isPreprocessorNode(context, unit)
    ? unit.scopeCaches.preprocessor
    : unit.scopeCaches.regular;
  const scope = scopeCache.get(context);
  if (!scope) {
    return items;
  }
  if (followElement.kind === FollowKind.LocalReference) {
    const symbols = scope.allDistinctSymbols([]);
    for (const symbol of symbols) {
      if (symbol.rawName) {
        items.push({
          label: symbol.rawName,
          kind: getCompletionKind(symbol.node),
          text: symbol.rawName,
        });
      }
    }
  } else if (followElement.kind === FollowKind.QualifiedReference) {
    const ref = followElement.previous.element?.ref;
    if (!ref) {
      return items;
    }
    const qualifiedName = getQualifiedName(ref);
    const symbols = scope.allDistinctSymbols(qualifiedName);
    for (const symbol of symbols) {
      if (symbol.rawName) {
        items.push({
          label: symbol.rawName,
          kind: getCompletionKind(symbol.node),
          text: symbol.rawName,
        });
      }
    }
  }
  return items;
}

function getCompletionKind(node: SyntaxNode): CompletionItemKind {
  switch (node.kind) {
    case SyntaxKind.LabelPrefix: {
      const statement = node.container as Statement;
      const value = statement.value;
      if (value && value.kind === SyntaxKind.ProcedureStatement) {
        return CompletionItemKind.Function;
      }
      return CompletionItemKind.Variable;
    }
  }
  return CompletionItemKind.Variable;
}

function isPreprocessorNode(node: SyntaxNode, unit: CompilationUnit): boolean {
  let parent = node;
  while (parent.container) {
    parent = parent.container;
  }
  return unit.preprocessorAst === parent;
}
