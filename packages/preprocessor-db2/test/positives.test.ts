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
import { join } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("DB2 SQL Positive Tests", async () => {
  const preprocessor = new Db2SqlPreprocessor();
  const fileName = join(__dirname, "positives.sql");
  const content = await readFile(fileName, "utf-8");
  const statements = content
    .split(/\r?\n/)
    .map((statement, index) => ({ line: index + 1, statement }));
  const blocks = statements.reduce(
    (acc, { line, statement }) => {
      if (statement.trim() === "---") {
        acc.push({ line, statement: "" });
      } else {
        acc[acc.length - 1].statement += `\n${statement}`;
      }
      return acc;
    },
    [{ line: 0, statement: "" }] as { line: number; statement: string }[],
  );

  test.each(blocks)("should parse statements", async ({ line, statement }) => {
    const { diagnostics } = await preprocessor.execute(statement);
    expect(
      diagnostics,
      diagnostics.length > 0
        ? `Error at ${fileName}:${line}: ${diagnostics[0].message}`
        : undefined,
    ).toHaveLength(0);
  });
});
