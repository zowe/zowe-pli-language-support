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
import { SyntaxNode } from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { CompletionItem } from "../types";
import { FollowElement, FollowKind } from "./follow-elements";
import { getQualifiedName } from "../../linking/resolver";

export interface SimpleCompletionItem extends Omit<CompletionItem, "edit"> {
  text: string;
}

export function generateCompletionItems(
  unit: CompilationUnit,
  context: SyntaxNode | undefined,
  followElement: FollowElement
): SimpleCompletionItem[] {
  const items: SimpleCompletionItem[] = [];
  if (followElement.kind === FollowKind.CstNode) {
    return [];
  }
  if (followElement.kind === FollowKind.QualifiedReference) {
    context = followElement.previous;
  } else if (!context) {
    return [];
  }
  const scopeCache = isPreprocessorNode(context, unit)
    ? unit.scopeCaches.preprocessor
    : unit.scopeCaches.regular;
  const scope = scopeCache.get(context);
  if (!scope) {
    return [];
  }
  if (followElement.kind === FollowKind.LocalReference) {
    const symbols = scope.allDistinctSymbols([]);
    for (const symbol of symbols) {
      if (symbol.name) {
        items.push({
          label: symbol.name,
          kind: CompletionItemKind.Variable,
          text: symbol.name
        });
      }
    }
  } else if (followElement.kind === FollowKind.QualifiedReference) {
    const ref = followElement.previous.element?.ref;
    if (!ref) {
      return [];
    }
    const qualifiedName = getQualifiedName(ref);
    const symbols = scope.allDistinctSymbols(qualifiedName);
    for (const symbol of symbols) {
      if (symbol.name) {
        items.push({
          label: symbol.name,
          kind: CompletionItemKind.Variable,
          text: symbol.name
        });
      }
    }
  }
  return items;
}

function isPreprocessorNode(node: SyntaxNode, unit: CompilationUnit): boolean {
  let parent = node;
  while (parent.container) {
    parent = parent.container;
  }
  return (unit.preprocessorAst.statements as SyntaxNode[]).includes(parent);
}