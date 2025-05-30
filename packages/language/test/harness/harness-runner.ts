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

import { createTestBuilder } from "../test-builder";
import { createHarnessImplementation } from "./harness-implementation";
import { HarnessTest } from "./types";

const vm = require("vm");

export function runHarnessTest(testFile: HarnessTest) {
  const firstFile = testFile.files.values().next().value!;

  const testBuilder = createTestBuilder(firstFile.content);
  const implementationSandbox = createHarnessImplementation(testBuilder);
  const vmContext = vm.createContext(implementationSandbox);

  vm.runInContext(testFile.commands, vmContext);
}
