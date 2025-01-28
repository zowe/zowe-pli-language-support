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

import { AstNode } from "langium";
import {
  AbstractSemanticTokenProvider,
  SemanticTokenAcceptor,
} from "langium/lsp";
import {
  isDeclaredVariable,
  isDefineAliasStatement,
  isDoType3Variable,
  isEndStatement,
  isLabelPrefix,
  isLabelReference,
  isLiteral,
  isNumberLiteral,
  isProcedureCall,
  isProcedureParameter,
  isProcedureStatement,
  isReferenceItem,
  isStringLiteral,
} from "../generated/ast";
import { SemanticTokenTypes } from "vscode-languageserver";

export class PliSemanticTokenProvider extends AbstractSemanticTokenProvider {
  protected override highlightElement(
    node: AstNode,
    acceptor: SemanticTokenAcceptor,
  ): void | undefined | "prune" {
    if (isReferenceItem(node)) {
      const targetElement = node.ref?.ref;
      acceptor({
        node,
        property: "ref",
        type: isProcedureStatement(targetElement)
          ? SemanticTokenTypes.function
          : SemanticTokenTypes.variable,
      });
    } else if (isDeclaredVariable(node) || isDoType3Variable(node)) {
      acceptor({
        node,
        property: "name",
        type: SemanticTokenTypes.variable,
      });
    } else if (isDefineAliasStatement(node)) {
      acceptor({
        node,
        property: "name",
        type: SemanticTokenTypes.type,
      });
    } else if (isProcedureParameter(node)) {
      acceptor({
        node,
        property: "id",
        type: SemanticTokenTypes.parameter,
      });
    } else if (isEndStatement(node)) {
      const container = node.$container;
      acceptor({
        node,
        property: "label",
        type: isProcedureStatement(container)
          ? SemanticTokenTypes.function
          : SemanticTokenTypes.variable,
      });
    } else if (isLabelReference(node)) {
      acceptor({
        node,
        property: "label",
        type: SemanticTokenTypes.variable,
      });
    } else if (isProcedureCall(node)) {
      acceptor({
        node,
        property: "procedure",
        type: SemanticTokenTypes.function,
      });
    } else if (isLabelPrefix(node)) {
      const container = node.$container;
      acceptor({
        node: node,
        property: "name",
        type: isProcedureStatement(container)
          ? SemanticTokenTypes.function
          : SemanticTokenTypes.variable,
      });
    } else if (isNumberLiteral(node)) {
      acceptor({
        node,
        property: "value",
        type: SemanticTokenTypes.number,
      });
    } else if (isStringLiteral(node)) {
      acceptor({
        node,
        property: "value",
        type: SemanticTokenTypes.string,
      });
    } else if (isLiteral(node)) {
      acceptor({
        node,
        property: "multiplier",
        type: SemanticTokenTypes.number,
      });
    }
  }
}
