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

import { FileSystemProvider } from "../../src/workspace/file-system-provider";
import {
  createTestBuilder,
  DEFAULT_FILE_URI,
  PliTestFile,
} from "../test-builder";
import { createHarnessImplementation } from "./harness-implementation";
import { HarnessTest, UnnamedFile } from "./types";

const vm = require("vm");

/**
 * Get the files to load for a harness test.
 *
 * @param testFile - The test file to get the files for.
 * @returns The files to load for the harness test.
 */
function getFiles(testFile: HarnessTest): PliTestFile[] {
  return Array.from(testFile.files.entries()).map(([uri, file]) => ({
    uri: uri === UnnamedFile ? DEFAULT_FILE_URI : uri,
    content: file.content,
  }));
}

/**
 * Run a harness test.
 *
 * @param testFile - The test file to run.
 * @param fileSystemProvider - The file system provider to use to load the files.
 */
export function runHarnessTest(
  testFile: HarnessTest,
  fileSystemProvider: FileSystemProvider,
) {
  // We want to load the files in reverse order, so that the included files are inserted in the correct order.
  const files = getFiles(testFile).toReversed();
  const testBuilder = createTestBuilder(files, { fs: fileSystemProvider });
  const implementationSandbox = createHarnessImplementation(testBuilder);
  const vmContext = vm.createContext(implementationSandbox);

  vm.runInContext(testFile.commands, vmContext);
}
