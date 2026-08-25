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

describe("DB2 SQL negatives", async () => {
  const preprocessor = new Db2SqlPreprocessor();

  test("Put nnnn instead of nnnn.d number", async () => {
    const { diagnostics } = preprocessor.parse(`
        ALTER PROCEDURE pname1
        GET_ACCEL_ARCHIVE YES
        ACCELERATION WAITFORDATA 1234
    `);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe("a DECIMAL(5,1) numeric-constant is only allowed");
  });

  test("Put n.d instead of nnnn.d number", async () => {
    const { diagnostics } = preprocessor.parse(`
        ALTER PROCEDURE pname1
        GET_ACCEL_ARCHIVE YES
        ACCELERATION WAITFORDATA 1.5
    `);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe("a DECIMAL(5,1) numeric-constant is only allowed");
  });

  test("SET OPTIMIZATION HINT requires EQUAL", async () => {
    const { diagnostics } = preprocessor.parse(`
        SET CURRENT OPTIMIZATION HINT :AREA
    `);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe("missing '=' at ':'");
  });

  test("SET DEGREE requires EQUAL", async () => {
    const { diagnostics } = preprocessor.parse(`
        SET CURRENT DEGREE :AREA
    `);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe("missing '=' at ':'");
  });
});