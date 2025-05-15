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

import { describe, test } from "vitest";
import { expectCompletions } from "../utils";

describe("Completion", () => {
  test("Provides completion for local references", () => {
    expectCompletions(
      `
      DCL A char(10);
      DCL B char(10);
      DCL C char(10);
      A = <|>123;
    `,
      [["A", "B", "C"]],
    );
  });

  test("Provides completion for fully qualified references", () => {
    expectCompletions(
      `
      DCL 1 A, 2 B, 3 C, 4 D char(10);
      DCL X char(10);
      X = <|>A.<|>B.<|>C.<|>D;
    `,
      [["A", "B", "C", "D", "X"], ["B", "C", "D"], ["C", "D"], ["D"]],
    );
  });
});
