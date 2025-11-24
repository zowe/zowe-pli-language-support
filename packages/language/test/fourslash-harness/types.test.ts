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
import { extractTestModeFromFileName, HarnessTestMode } from "./types";

describe("Test Mode extraction", () => {
  test("Extract Normal mode", () => {
    const normalMode = extractTestModeFromFileName("some-test-file-name.ts");
    expect(normalMode).toBe(HarnessTestMode.Normal);
  });

  test("Extract Todo mode", () => {
    const todoMode = extractTestModeFromFileName("some-test-file-name.todo.ts");
    expect(todoMode).toBe(HarnessTestMode.Todo);
  });

  test("Extract Skip mode", () => {
    const skipMode = extractTestModeFromFileName("some-test-file-name.skip.ts");
    expect(skipMode).toBe(HarnessTestMode.Skip);
  });

  test("Extract Fail mode", () => {
    const failMode = extractTestModeFromFileName("some-test-file-name.fail.ts");
    expect(failMode).toBe(HarnessTestMode.Fail);
  });
});
