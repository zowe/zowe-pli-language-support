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
import { afterAll, beforeAll, describe, test } from "vitest";
import { parseHarnessTestFile } from "./harness-parser";
import { runHarnessTest } from "./harness-runner";
import { getWrappers } from "./wrapper";
import { setFileSystemProvider, VirtualFileSystemProvider } from "../../src";

const frameworkFileName = "framework.ts";
const testsPath = path.resolve(__dirname, "tests");

let vfs: VirtualFileSystemProvider;

beforeAll(() => {
  vfs = new VirtualFileSystemProvider();
  setFileSystemProvider(vfs);
});

afterAll(() => {
  setFileSystemProvider(undefined);
});

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
  const files = getTestFiles();

  for (const filePath of files) {
    const fullPath = path.resolve(testsPath, filePath);
    runSingleHarnessTest(fullPath);
  }
}

/**
 * Run a single harness test file.
 *
 * @param filePath - The path to the test file.
 */
function runSingleHarnessTest(filePath: string) {
  const wrappers = getWrappers();

  const context = {
    wrappers,
  };

  const testFile = parseHarnessTestFile(filePath, context);

  test(`${filePath}`, () => runHarnessTest(testFile, vfs));
}

/**
 * Used by launch.json to run a single test file
 */
const { HARNESS_TEST_FILE } = process.env;

/**
 * If HARNESS_TEST_FILE is set, run the test file specified by the environment variable.
 */
if (!HARNESS_TEST_FILE) {
  describe("Harness tests", runHarnessTests);
} else {
  if (
    !path
      .relative(__dirname, HARNESS_TEST_FILE)
      .startsWith(path.relative(__dirname, testsPath))
  ) {
    throw new Error(
      `HARNESS_TEST_FILE must be a path within the tests directory, got ${HARNESS_TEST_FILE}`,
    );
  }

  const fullPath = path.resolve(HARNESS_TEST_FILE);
  runSingleHarnessTest(fullPath);
}
