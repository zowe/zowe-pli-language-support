/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import { describe, expect, test } from "vitest";
import { parseStmts } from "../utils";
import {
  DoStatement,
  IfStatement,
  OnStatement,
  SyntaxKind,
} from "../../src/syntax-tree/ast";
import { collectNodesOfKind } from "../../src/syntax-tree/ast-iterator";
import {
  conditionKey,
  conditionToText,
  doHeaderText,
  expressionToText,
  isIterativeDo,
  normalizeSource,
  truncate,
} from "../../src/flow-diagram/statement-text";

async function ifCondition(condition: string): Promise<string> {
  const unit = await parseStmts(` IF ${condition} THEN X = 1;`);
  const [ifStmt] = collectNodesOfKind<IfStatement>(
    unit.ast,
    SyntaxKind.IfStatement,
  );
  return expressionToText(ifStmt.expression);
}

async function doStatement(header: string): Promise<DoStatement> {
  // Column 1 is outside the default PL/I margins, hence the leading blanks.
  const unit = await parseStmts(` ${header}\n END;`);
  return collectNodesOfKind<DoStatement>(unit.ast, SyntaxKind.DoStatement)[0];
}

async function onConditions(conditions: string): Promise<string[]> {
  const unit = await parseStmts(` ON ${conditions} X = 1;`);
  const [on] = collectNodesOfKind<OnStatement>(
    unit.ast,
    SyntaxKind.OnStatement,
  );
  return on.conditions.map(conditionToText);
}

describe("Flow diagram statement text", () => {
  test.each([
    ["A > B", "A > B"],
    ["A >= B & C ¬= D", "A >= B & C ¬= D"],
    ["(A + B) * C", "(A + B) * C"],
    ["¬EOF", "¬EOF"],
    ["-X < 0", "-X < 0"],
    ["REC.CODE = 'AB'", "REC.CODE = 'AB'"],
    ["P->NODE.NEXT = NULL()", "P->NODE.NEXT = NULL()"],
    ["TABLE(I, J + 1) = 3.5E0", "TABLE(I, J + 1) = 3.5E0"],
    ["FLAG = '1'B | NAME || 'X' = 'AX'", "FLAG = '1'B | NAME || 'X' = 'AX'"],
  ])("renders the expression %s", async (source, expected) => {
    expect(await ifCondition(source)).toBe(expected);
  });

  test.each([
    ["DO WHILE (I < N);", "WHILE (I < N)", true],
    ["DO UNTIL (EOF);", "UNTIL (EOF)", true],
    ["DO WHILE (A) UNTIL (B);", "WHILE (A) UNTIL (B)", true],
    ["DO I = 1 TO 10 BY 2;", "I = 1 TO 10 BY 2", true],
    ["DO I = 1, 5, 9;", "I = 1, 5, 9", true],
    ["DO I = N TO 1 BY -1 WHILE (OK);", "I = N TO 1 BY -1 WHILE (OK)", true],
    ["DO LOOP;", "LOOP", true],
    ["DO;", "", false],
  ])("renders the DO header of %s", async (source, header, iterative) => {
    const stmt = await doStatement(source);
    expect(doHeaderText(stmt)).toBe(header);
    expect(isIterativeDo(stmt)).toBe(iterative);
  });

  test("renders keyword, file and named conditions", async () => {
    expect(await onConditions("ZERODIVIDE")).toEqual(["ZERODIVIDE"]);
    expect(await onConditions("ENDFILE(SYSIN)")).toEqual(["ENDFILE(SYSIN)"]);
    expect(await onConditions("CONDITION(MYCOND)")).toEqual([
      "CONDITION(MYCOND)",
    ]);
  });

  test("condition keys ignore spacing so SIGNAL and ON match", async () => {
    const unit = await parseStmts(
      " ON ENDFILE( SYSIN ) X = 1;\n SIGNAL ENDFILE(SYSIN);",
    );
    const [on] = collectNodesOfKind<OnStatement>(
      unit.ast,
      SyntaxKind.OnStatement,
    );
    const [signal] = collectNodesOfKind(unit.ast, SyntaxKind.SignalStatement);
    expect(conditionKey(on.conditions[0])).toBe(
      conditionKey(
        (signal as { condition: OnStatement["conditions"] }).condition[0],
      ),
    );
  });

  test("truncates long text with an ellipsis", () => {
    expect(truncate("SHORT", 10)).toBe("SHORT");
    expect(truncate("0123456789AB", 10)).toBe("012345678…");
    expect(truncate("x".repeat(48))).toHaveLength(48);
    expect(truncate("x".repeat(49))).toHaveLength(48);
  });

  test("normalizes source snippets to a single line without comments", () => {
    expect(normalizeSource("PUT SKIP\n     LIST(A, /* the total */ B);")).toBe(
      "PUT SKIP LIST(A, B);",
    );
    expect(normalizeSource("X = 1; /* unterminated")).toBe("X = 1;");
  });
});
