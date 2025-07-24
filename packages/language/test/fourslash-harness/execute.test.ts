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
import { afterEach, beforeEach, describe, test } from "vitest";
import { parseHarnessTestFile } from "./harness-parser";
import { runHarnessTest } from "./harness-runner";
import { getWrappers } from "./wrapper";
import { setFileSystemProvider, VirtualFileSystemProvider } from "../../src";
import { HarnessTest, UnnamedFile } from "./types";
import {
  DEFAULT_FILE_URI,
  LocationOverride,
  PliTestFile,
  TestBuilder,
} from "../test-builder";
import { createTestBuilderHarnessImplementation } from "./implementation/test-builder";
import { resetDocumentProviders } from "../../src/language-server/text-documents";
import {
  PluginConfigurationProviderInstance,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";

const frameworkFileName = "framework.ts";
const testsPath = "packages/language/test/fourslash";

/**
 * The root of the project.
 *
 * Important: Assume that the test files exist in the `packages/language/test/fourslash` directory.
 */
const projectRoot = path.join(__dirname, "../../../..");

/**
 * The path to the `fourslash` directory.
 *
 * Important: Assume that the test files exist in the `packages/language/test/fourslash` directory.
 */
const fourslashPath = path.join(__dirname, "../fourslash");

let fs: VirtualFileSystemProvider;

beforeEach(() => {
  fs = new VirtualFileSystemProvider();
  setFileSystemProvider(fs);
  resetDocumentProviders();

  // Clear the plugin configuration provider and
  // ensure the 'cpy' directory is always resolvable for includes via config
  setPluginConfigurationProvider();
  PluginConfigurationProviderInstance.setProgramConfigs("", [
    {
      program: "*.pli",
      pgroup: "default",
    },
  ]);
  PluginConfigurationProviderInstance.setProcessGroupConfigs([
    {
      name: "default",
      libs: ["cpy"],
      "include-extensions": [".pli"],
    },
  ]);
});

afterEach(() => {
  setFileSystemProvider(undefined);
  PluginConfigurationProviderInstance.setProgramConfigs("", []);
  PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
});

function getTestFiles() {
  return readdirSync(testsPath, { recursive: true })
    .map((file) => file.toString())
    .filter((file) => file.endsWith(".ts")) // Only .ts files
    .filter((file) => file !== frameworkFileName); // No framework file
}

function prefixUri(uri: string): string {
  if (uri.startsWith("file:///")) {
    return uri;
  }

  if (uri.startsWith("/")) {
    return `file://${uri}`;
  }

  return `file:///${uri}`;
}

function getUri(uri: string | typeof UnnamedFile): string {
  return uri === UnnamedFile ? DEFAULT_FILE_URI : uri;
}

/**
 * Get the files to load for a harness test.
 *
 * @param testFile - The test file to get the files for.
 * @returns The files to load for the harness test.
 */
function getFiles(testFile: HarnessTest): PliTestFile[] {
  return Array.from(testFile.files.entries()).map(([uri, file]) => ({
    uri: getUri(uri),
    content: file.content,
  }));
}

function getLocationOverrides(
  testFile: HarnessTest,
  path: string,
): Record<string, LocationOverride> {
  return Object.fromEntries(
    Array.from(testFile.files.entries()).map(([uri, file]) => [
      prefixUri(getUri(uri)),
      {
        uri: path,
        lineOffset: file.lineOffset,
        characterOffset: file.characterOffset,
      },
    ]),
  );
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
  // e.g. 'linker/implicit-declaration.ts'
  const relativePath = path.relative(fourslashPath, filePath);
  // e.g. 'packages/language/test/fourslash/linker/implicit-declaration.ts'
  const relativePathToProjectRoot = path.relative(projectRoot, filePath);

  test(`${relativePath}`, () => {
    const wrappers = getWrappers();
    const testFile = parseHarnessTestFile(relativePath, filePath, {
      wrappers,
    });

    const locationOverrides = getLocationOverrides(
      testFile,
      relativePathToProjectRoot,
    );

    // We want to load the files in reverse order, so that the included files are inserted in the correct order.
    const files = getFiles(testFile).toReversed();
    const testBuilder = TestBuilder.create(files, {
      fs,
      validate: true,
      locationOverrides,
    });
    const implementation = createTestBuilderHarnessImplementation(testBuilder);

    runHarnessTest(testFile, implementation);
  });
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
