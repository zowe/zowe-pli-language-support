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
import { ParseTree } from "antlr4ng";
import { Token, SemanticsKind } from "preprocessor-api";
import { CicsWordContext } from "../generated/CICSParser";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";

export class CollectingIdentifierVisitor extends CICSParserVisitor<void> {
  static collect(tree: ParseTree): Token[] {
    const visitor = new CollectingIdentifierVisitor();
    tree.accept(visitor);
    return visitor.identifiers;
  }
  readonly identifiers: Token[] = [];
  override visitCicsWord = (ctx: CicsWordContext): void => {
    const symbol = ctx.WORD_IDENTIFIER()?.getSymbol();
    if (symbol && symbol.text) {
      this.identifiers.push({
        image: symbol.text,
        startOffset: symbol.start,
        endOffset: symbol.stop,
        semanticsKind: SemanticsKind.Identifier,
      });
    }
  };
}
