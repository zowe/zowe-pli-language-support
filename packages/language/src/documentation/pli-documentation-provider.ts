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

import { AstNode, JSDocDocumentationProvider } from "langium";
import {
  isDeclaredVariable,
  isDoType3Variable,
  isLabelPrefix,
  isProcedureStatement,
  ProcedureStatement,
} from "../generated/ast";

export class PliDocumentationProvider extends JSDocDocumentationProvider {
  override getDocumentation(node: AstNode): string | undefined {
    if (isDeclaredVariable(node)) {
      const declaredItem = node.$container;
      let text = "```\n" + `DECLARE ${node.name} `;
      for (const attribute of declaredItem.attributes) {
        text += `${attribute.$cstNode?.text} `;
      }
      text += "\n```";
      return text;
    } else if (isLabelPrefix(node) && isProcedureStatement(node.$container)) {
      return this.getProcedureHoverContent(node.$container);
    } else if (isProcedureStatement(node)) {
      return this.getProcedureHoverContent(node);
    } else if (isDoType3Variable(node)) {
      return "```\nDECLARE" + node.name + "\n```";
    }
    return "";
  }

  private getProcedureHoverContent(
    node: ProcedureStatement,
  ): string | undefined {
    let text = "```\n";
    for (const label of node.labels) {
      text += `${label.name} `;
    }
    text += "PROCEDURE ";
    if (node.parameters.length > 0) {
      text += "(" + node.parameters.map((e) => e.id).join(", ") + ") ";
    }
    if (node.recursive.length > 0) {
      text += "RECURSIVE ";
    }
    if (node.order.includes("ORDER")) {
      text += "ORDER ";
    } else if (node.order.includes("REORDER")) {
      text += "REORDER ";
    }
    if (node.options.length > 0) {
      text += node.options.map((e) => e.$cstNode?.text).join(" ");
    }
    if (node.returns.length > 0) {
      text += node.returns.map((e) => e.$cstNode?.text).join(" ");
    }
    text += "\n```";
    return text;
  }
}
