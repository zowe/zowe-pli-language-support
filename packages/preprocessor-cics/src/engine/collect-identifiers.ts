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
import {
  CicsLexerDefinedVariableUsageTokensContext,
  CicsWordContext,
  CicsWordsContext,
} from "../generated/CICSParser";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";

export class CollectingIdentifierVisitor extends CICSParserVisitor<void> {
  static collect(tree: ParseTree): Token[] {
    const visitor = new CollectingIdentifierVisitor();
    tree.accept(visitor);
    return visitor.identifiers;
  }
  readonly identifiers: Token[] = [];
  private pushIdentifier = (
    image: string,
    startOffset: number,
    endOffset: number,
  ): void => {
    this.identifiers.push({
      //because linking is case-insensitive
      image: image.toUpperCase(),
      startOffset,
      endOffset,
      semanticsKind: SemanticsKind.Identifier,
    });
  };
  override visitCicsLexerDefinedVariableUsageTokens = (
    ctx: CicsLexerDefinedVariableUsageTokensContext,
  ): void => {
    if (ctx.start && ctx.stop) {
      this.pushIdentifier(ctx.getText(), ctx.start.start, ctx.stop.stop);
    }
  };
  override visitCicsWords = (words: CicsWordsContext): void => {
    if (words.start && words.stop) {
      this.pushIdentifier(words.getText(), words.start.start, words.stop.stop);
    }
  };
  override visitCicsWord = (ctx: CicsWordContext): void => {
    const symbol = ctx.WORD_IDENTIFIER()?.getSymbol();
    if (symbol && symbol.text) {
      this.pushIdentifier(symbol.text, symbol.start, symbol.stop);
    } else {
      this.visitChildren(ctx);
    }
  };
}
