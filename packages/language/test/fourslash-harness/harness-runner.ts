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

import { HarnessTesterInterface } from "./harness-interface";
import { HarnessTest } from "./types";

const vm = require("vm");

/**
 * Run a harness test.
 *
 * @param testFile - The test file to run.
 * @param implementation - The implementation to use to run the harness test.
 */
export function runHarnessTest(
  testFile: HarnessTest,
  implementation: HarnessTesterInterface,
) {
  const vmContext = vm.createContext(implementation);

  vm.runInContext(testFile.commands, vmContext, {
    filename: testFile.fileName,
  });
}
