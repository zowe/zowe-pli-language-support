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
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("CICS Preprocessor: Positives", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);
  const fileName = join(__dirname, "positives.txt");
  const content = await readFile(fileName, "utf-8");
  const statements = content
    .split(/\r?\n/)
    .map((statement, index) => ({ line: index + 1, statement }));

  test.each(statements)("should parse statements", ({ line, statement }) => {
    const { diagnostics } = cicsPreprocessor.parse(statement);
    expect(
      diagnostics,
      diagnostics.length > 0
        ? `Error at ${fileName}:${line}:\n` +
            diagnostics
              .map((diagnostic) => `- ${diagnostic.message}`)
              .join("\n")
        : undefined,
    ).toHaveLength(0);
  });
});
