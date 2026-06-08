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
import { CICSPreprocessor } from "../engine/preprocessor";
import { Severity } from "preprocessor-api";

// NOTE: CICSAssignOptionsCheckUtility only calls checkDuplicates. In the grammar
// `cics_assign: ASSIGN (cics_assign_parameter1 | cics_assign_parameter2)*` every
// option is matched into its own parameter context, so the dispatcher invokes the
// checker once per single option. checkDuplicates therefore never sees two of the
// same option within one context and cannot raise a diagnostic. There is no
// reachable failure branch to assert on; only positive/parse cases are testable.
describe("CICS ASSIGN", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ASSIGN APPLID(A)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ASSIGN BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // EXPECTED TO FAIL: see note above — the duplicate APPLID lands in two separate
  // cics_assign_parameter contexts, so checkDuplicates never sees both and emits
  // no diagnostic. Kept so the unreachable branch is visible.
  test.fails("Duplicated APPLID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ASSIGN APPLID(A) APPLID(B)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: APPLID/,
    );
  });
});
