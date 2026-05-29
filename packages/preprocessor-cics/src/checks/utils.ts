import { ParserRuleContext, ParseTree, TerminalNode } from "antlr4ng";
import { WithRange } from "preprocessor-api";

export const VisitorUtility = {
  constructLocality(ctx: ParseTree): WithRange {
    if (ctx instanceof TerminalNode) {
      return {
        startOffset: ctx.symbol.start,
        endOffset: ctx.symbol.stop + 1,
      };
    }
    assertType<ParserRuleContext>(ctx);
    return {
      startOffset: ctx.start ? ctx.start.start : 0,
      endOffset: ctx.stop ? ctx.stop.stop + 1 : 0,
    };
  },
};

export function assertType<T>(
  value: any,
  message?: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || "Assertion failed");
  }
}
