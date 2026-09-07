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
import { ParserRuleContext, ParseTree, TerminalNode } from "antlr4ng";
import { Range } from "preprocessor-api";

export const VisitorUtility = {
  /** Returns the node's span as an api {@link Range} (exclusive `end`, i.e. ANTLR `stop + 1`). */
  constructLocality(ctx: ParseTree): Range {
    if (ctx instanceof TerminalNode) {
      return { start: ctx.symbol.start, end: ctx.symbol.stop + 1 };
    }
    assertType<ParserRuleContext>(ctx);
    const start = ctx.start ? ctx.start.start : 0;
    return { start, end: ctx.stop ? ctx.stop.stop + 1 : start + 1 };
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

export function orify(items: string[]): string {
  if (items.length === 0) {
    return "";
  } else if (items.length === 1) {
    return items[0];
  } else if (items.length === 2) {
    return `${items[0]} or ${items[1]}`;
  } else {
    const lastItem = items.pop();
    return `${items.join(", ")} or ${lastItem}`;
  }
}
