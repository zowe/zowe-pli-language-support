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

describe("CICS SUSPEND", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SUSPEND ACTIVITY(A)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SUSPEND BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkSuspend -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive ACQACTIVITY and ACQPROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SUSPEND ACQACTIVITY ACQPROCESS",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: ACQACTIVITY or ACQPROCESS or ACTIVITY/,
    );
  });

  // checkDuplicates
  test("Duplicated ACQACTIVITY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SUSPEND ACQACTIVITY ACQACTIVITY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ACQACTIVITY/,
    );
  });
});
