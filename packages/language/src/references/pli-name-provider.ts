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

import { AstNode, CstNode, DefaultNameProvider } from "langium";
import { isProcedureStatement } from "../generated/ast";

export class PliNameProvider extends DefaultNameProvider {
  override getName(node: AstNode): string | undefined {
    if (isProcedureStatement(node)) {
      const label = node.$container.labels[0];
      return label?.name || undefined;
    } else {
      return super.getName(node);
    }
  }
  override getNameNode(node: AstNode): CstNode | undefined {
    if (isProcedureStatement(node)) {
      const label = node.$container.labels[0];
      if (label) {
        return this.getNameNode(label);
      } else {
        return undefined;
      }
    } else {
      return super.getNameNode(node);
    }
  }
}
