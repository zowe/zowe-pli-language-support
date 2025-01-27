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

import { AstNode, AstNodeDescription, isAstNodeDescription } from "langium";
import { DefaultNodeKindProvider } from "langium/lsp";
import { CompletionItemKind, SymbolKind } from "vscode-languageserver-types";
import {
  isLabelPrefix,
  isNamedElement,
  isPackage,
  isProcedureStatement,
} from "../generated/ast";

export class PliNodeKindProvider extends DefaultNodeKindProvider {
  override getSymbolKind(node: AstNode | AstNodeDescription): SymbolKind {
    const symbol = this.getNode(node);
    if (!symbol) {
      return SymbolKind.Null;
    }
    if (isProcedureStatement(symbol)) {
      return SymbolKind.Function;
    } else if (isNamedElement(symbol)) {
      return SymbolKind.Variable;
    } else if (isPackage(symbol)) {
      return SymbolKind.Namespace;
    } else if (isLabelPrefix(symbol)) {
      return SymbolKind.Constant;
    } else {
      return SymbolKind.Variable;
    }
  }

  override getCompletionItemKind(
    node: AstNode | AstNodeDescription,
  ): CompletionItemKind {
    const symbol = this.getNode(node);
    if (!symbol) {
      return CompletionItemKind.Text;
    }
    if (isProcedureStatement(symbol)) {
      return CompletionItemKind.Function;
    } else if (isNamedElement(symbol)) {
      return CompletionItemKind.Variable;
    } else if (isPackage(symbol)) {
      return CompletionItemKind.Module;
    } else if (isLabelPrefix(symbol)) {
      return CompletionItemKind.Constant;
    }
    return CompletionItemKind.Variable;
  }

  private getNode(node: AstNode | AstNodeDescription): AstNode | undefined {
    if (isAstNodeDescription(node)) {
      return node.node;
    }
    return node;
  }
}
