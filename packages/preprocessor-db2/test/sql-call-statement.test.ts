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
import { describe, expect, test } from "vitest";
import { Db2SqlPreprocessor } from "../src/engine/preprocessor";
import { SemanticsKind } from "preprocessor-api";

describe("DB2 SQL call statement", async () => {
  const preprocessor = new Db2SqlPreprocessor();

  test("CALL", async () => {
    const { diagnostics, tokens } = await preprocessor.execute(`
           CALL myProc USING DESCRIPTOR :SQLD
       `);
    expect(diagnostics).toHaveLength(0);
    expect(
      tokens.find(
        (t) =>
          t.semanticsKind === SemanticsKind.Identifier && t.image === "SQLD",
      ),
    ).toBeTruthy();
  });
});
