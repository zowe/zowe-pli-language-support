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

import path from "path";
import { afterEach, describe, test } from "vitest";
import { parseHarnessTestFile } from "./harness-parser";
import { runHarnessTest } from "./harness-runner";
import { getWrappers } from "./wrapper";
import {
  extractTestModeFromFileName,
  HarnessTest,
  HarnessTestMode,
} from "./types";
import { LocationOverride, TestBuilder } from "../test-builder";
import { createTestBuilderHarnessImplementation } from "./implementation/test-builder";
import {
  createTestWorkspace,
  defaultTestWorkspace,
  setDefaultTestWorkspace,
} from "../test-workspace";
import { HarnessTesterInterface } from "./harness-interface";
import { UriUtils } from "../../src/utils/uri";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import {
  fourslashPath,
  getFiles,
  getTestFiles,
  projectRoot,
  testsPath,
} from "./utils";
import { createCompilerTestHarnessImplementation } from "./implementation/compiler-test-builder";
import { CompilerTestBuilder } from "../compiler-test-builder";

afterEach(async () => {
  defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), []);
  await defaultTestWorkspace().config.setProcessGroupConfigs([]);
  setDefaultTestWorkspace(undefined);
});

function getLocationOverrides(
  testFile: HarnessTest,
  path: string,
): Record<string, LocationOverride> {
  return Object.fromEntries(
    Array.from(testFile.files.entries()).map(([uri, file]) => [
      uri,
      {
        uri: path,
        lineOffset: file.lineOffset,
        characterOffset: file.characterOffset,
      },
    ]),
  );
}

interface FileTree {
  [key: string]: FileTree | string[];
  _files: string[];
}

function getFileTree(files: string[]): FileTree {
  const tree: FileTree = { _files: [] };
  for (const file of files) {
    const relativePath = path.relative(fourslashPath, file);
    const segments = relativePath
      .split(path.sep)
      .filter((segment) => segment !== "." && segment !== "..");
    let current = tree;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        current._files.push(segment);
      } else {
        if (!current[segment]) {
          current[segment] = { _files: [] };
        }
        current = current[segment] as FileTree;
      }
    }
  }
  return tree;
}

/**
 * Get all test files in the `tests` directory, parse them, and create a
 * vitest test for each test.
 */
function runHarnessTests() {
  const files = getTestFiles();

  // Get a tree with all files sorted into their relative path.
  const fileTree = getFileTree(files);

  const traverseFileTree = (tree: FileTree, currentPath: string) => {
    for (const key in tree) {
      if (key === "_files") {
        continue;
      }
      describe(key, () => {
        traverseFileTree(tree[key] as FileTree, path.join(currentPath, key));
      });
    }
    for (const file of tree._files) {
      const filepath = path.join(currentPath, file);
      const fullPath = path.resolve(testsPath, filepath);
      runSingleHarnessTest(fullPath);
    }
  };

  traverseFileTree(fileTree, "");
}

/**
 * Run a single harness test file.
 *
 * @param filePath - The path to the test file.
 */
function runSingleHarnessTest(filePath: string, timeout = 10_000) {
  // e.g. 'linker/implicit-declaration.ts'
  const relativePath = path.relative(fourslashPath, filePath);
  // e.g. 'packages/language/test/fourslash/linker/implicit-declaration.ts'
  const relativePathToProjectRoot = path.relative(projectRoot, filePath);
  const testName = relativePath.includes(path.sep)
    ? path.basename(relativePath)
    : relativePath;

  const testMode = extractTestModeFromFileName(testName);
  let testFn: typeof test.todo = test;
  if (testMode === HarnessTestMode.Todo) {
    testFn = test.todo;
  } else if (testMode === HarnessTestMode.Skip) {
    testFn = test.skip;
  } else if (testMode === HarnessTestMode.Fail) {
    testFn = test.fails;
  }

  testFn(
    `${testName}`,
    {
      timeout,
    },
    async (testRun) => {
      const wrappers = getWrappers();
      const testFile = await parseHarnessTestFile(relativePath, filePath, {
        wrappers,
      });

      const locationOverrides = getLocationOverrides(
        testFile,
        relativePathToProjectRoot,
      );

      // We want to load the files in reverse order, so that the included files are inserted in the correct order.
      const files = getFiles(testFile).toReversed();
      let implementation: HarnessTesterInterface;
      if (TEST_COMPILER_OUTPUT) {
        if (testFile.tags["compiler"] !== "true") {
          // If the test is not marked as a compiler test, simply skip it
          testRun.skip();
        }
        const outputDir = relativePath.endsWith(".ts")
          ? relativePath.slice(0, -3)
          : relativePath;
        const fullOutputDir = path.join(TEST_COMPILER_OUTPUT, outputDir);
        const testBuilder = await CompilerTestBuilder.create(
          files,
          fullOutputDir,
        );
        implementation =
          await createCompilerTestHarnessImplementation(testBuilder);
      } else {
        const fs = new VirtualFileSystemProvider(
          testFile.tags["case-sensitive"] === "true",
        );
        setDefaultTestWorkspace(createTestWorkspace(fs));
        const testBuilder = await TestBuilder.create(files, {
          fs,
          validate: true,
          locationOverrides,
          // Keep the plugin configuration loaded after the build so that
        // config-dependent features (e.g. UnknownProcessGroup quick fixes)
        // can be exercised by harness tests. The afterEach hook above resets
        // the workspace config between tests, so this can't leak across tests.
        preservePluginConfiguration: true,
      });
        implementation = createTestBuilderHarnessImplementation(testBuilder);
      }

      await runHarnessTest(testFile, implementation);
    },
  );
}

/**
 * Used by launch.json to run a single test file
 */
const { HARNESS_TEST_FILE } = process.env;
/**
 * Used by the compiler tests, not set by the normal test runs
 */
const { TEST_COMPILER_OUTPUT } = process.env;

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
  runSingleHarnessTest(fullPath, 600_000); // 10 minute timeout for debugging
}
