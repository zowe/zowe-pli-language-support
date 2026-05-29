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
