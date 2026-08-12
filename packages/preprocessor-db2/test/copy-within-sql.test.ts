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

describe("DB2 SQL Copy within SQL Tests", async () => {
  const preprocessor = new Db2SqlPreprocessor();

  test("TEXT1", async () => {
    const { diagnostics, replacement } = preprocessor.parse(`
       INCLUDE COPY1
    `);
    expect(diagnostics).toHaveLength(0);
    expect(replacement).toBeDefined();
    if (replacement!.type === "include") {
      expect(replacement!.filePath).toBe("COPY1");
    }
  });

  test("TEXT2", async () => {
    const { diagnostics, replacement } = preprocessor.parse(`
       INCLUDE SQLCA
    `);
    expect(diagnostics).toHaveLength(0);
    expect(replacement).toBeDefined();
    if (replacement!.type === "include") {
      expect(replacement!.filePath).toBe("SQLCA");
    }
  });
});
