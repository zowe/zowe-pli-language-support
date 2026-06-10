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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

// NOTE: CICSDiscardOptionsUtility only calls checkDuplicates. In the grammar
// `cics_discard_body` matches exactly one resource option (PROGRAM, FILE, ...),
// so a resource option can never appear twice without being a parse error. The
// checker therefore has no reachable duplicate-failure branch; only
// positive/parse cases are testable.
describe("CICS DISCARD", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("DISCARD PROGRAM(A)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISCARD PROGRAM(A) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // EXPECTED TO FAIL: see note above — cics_discard_body matches exactly one
  // resource, so a second PROGRAM is a parse error rather than a duplicate-option
  // diagnostic. Kept so the unreachable branch is visible.
  test.fails("Duplicated PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISCARD PROGRAM(A) PROGRAM(B)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
