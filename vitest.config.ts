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

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://vitest.dev/config/
 */
import { env } from "process";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    deps: {
      interopDefault: true,
    },
    watchTriggerPatterns: [
      {
        pattern: /packages\/preprocessor-cics\/src\/test\/positives\.txt$/,
        testsToRun: () => {
          return ["packages/preprocessor-cics/src/test/positives.test.ts"];
        },
      },
      {
        pattern: /packages\/preprocessor-db2\/test\/positives\.sql$/,
        testsToRun: () => {
          return ["packages/preprocessor-db2/test/positives.test.ts"];
        },
      },
      {
        pattern: /packages\/language\/test\/fourslash\/.*\.ts$/,
        testsToRun: (file) => {
          env.HARNESS_TEST_FILE = file;
          return ["packages/language/test/fourslash-harness/execute.test.ts"];
        },
      },
    ],
    include: ["packages/**/test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["packages/language/src/**/*.ts"],
      thresholds: {
        lines: 83,
        statements: 83,
        branches: 75,
        functions: 65,
      },
    },
  },
});
