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
import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, test } from "vitest";
import { CICSPreprocessor } from "../preprocessor";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("CICS Dialect: Positives", () => {
  test("should parse statements", async () => {
    const content = await readFile(join(__dirname, "positives.txt"), "utf-8");
    const statements = content.split(/\r?\n/);
    const cicsPreprocessor = new CICSPreprocessor();
    let line = 1;
    for (const statement of statements) {
      const { diagnostics } = await cicsPreprocessor.execute(statement);
      expect(
        diagnostics,
        diagnostics.length > 0
          ? `Error at line ${line}: ${diagnostics[0].message}`
          : undefined,
      ).toHaveLength(0);
      line++;
    }
  });
});
