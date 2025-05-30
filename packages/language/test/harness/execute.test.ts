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

import { readdirSync } from "fs";
import path from "path";
import { describe, test } from "vitest";
import { parseHarnessTestFile } from "./harness-parser";
import { runHarnessTest } from "./harness-runner";
import { getWrappers } from "./wrapper";

const frameworkFileName = "framework.ts";
const testsPath = path.resolve(__dirname, "tests");

describe("Harness tests", runHarnessTests);

function getTestFiles() {
  return readdirSync(testsPath, { recursive: true })
    .map((file) => file.toString())
    .filter((file) => file.endsWith(".ts")) // Only .ts files
    .filter((file) => file !== frameworkFileName); // No framework file
}

/**
 * Get all test files in the `tests` directory, parse them, and create a
 * vitest test for each test.
 */
function runHarnessTests() {
  const wrappers = getWrappers();
  const files = getTestFiles();

  const context = {
    wrappers,
  };

  for (const file of files) {
    const testFile = parseHarnessTestFile(
      path.resolve(testsPath, file),
      context,
    );
    test(`${file}`, () => runHarnessTest(testFile));
  }
}
