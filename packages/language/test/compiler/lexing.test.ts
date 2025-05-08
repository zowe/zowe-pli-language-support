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

import { describe, test } from "vitest";
import { assertNoParseErrors, parse, parseStmts } from "../utils";

describe("CompilerOptions parser", () => {
  test("Should lex correct NOT without compiler option", () => {
    // Allow both ^ and ¬ as NOT operators by default
    const doc = parseStmts(`
  DECLARE VAR FIXED;
  VAR = ^VAR;
  VAR = ¬VAR;
  VAR = VAR ¬= VAR;
  VAR = VAR ^> VAR;
  VAR = VAR ¬> VAR;
  VAR = VAR ^< VAR;
    `);
    assertNoParseErrors(doc);
  });

  test("Should lex correct NOT compiler option", () => {
    const doc = parse(`*PROCESS NOT("~");
 MAIN: PROC;
   DECLARE VAR FIXED;
   VAR = ~VAR;
   VAR = VAR ~= VAR;
   VAR = VAR ~> VAR;
   VAR = VAR ~< VAR;
 END MAIN;
    `);
    assertNoParseErrors(doc);
  });

  test("Should lex correct OR without compiler option", () => {
    const doc = parseStmts(`
  DECLARE VAR FIXED;
  VAR = 1 | 2;
  VAR |= 2;
  VAR = 1 || 0;
  VAR ||= 0;
    `);
    assertNoParseErrors(doc);
  });

  test("Should lex correct OR compiler option", () => {
    const doc = parse(`*PROCESS OR('^');
 MAIN: PROC;
   DECLARE VAR FIXED;
   VAR = 1 ^ 2;
   VAR ^= 2;
   VAR = 1 ^^ 0;
   VAR ^^= 0;
 END MAIN;
    `);
    assertNoParseErrors(doc);
  });
});
