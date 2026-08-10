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
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";
import { Severity } from "preprocessor-api";

describe("CICS CHECK", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (ACTIVITY)", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CHECK ACTIVITY(1) COMPSTATUS(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CHECK ACTIVITY(1) COMPSTATUS(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkActivity -> checkHasExactlyOneOption (none provided)
  test("No ACTIVITY/ACQACTIVITY/ACQPROCESS", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CHECK COMPSTATUS(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACTIVITY or ACQACTIVITY or ACQPROCESS/,
    );
  });

  // checkActivity -> checkHasMandatoryOptions(COMPSTATUS)
  test("Missing COMPSTATUS", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CHECK ACTIVITY(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: COMPSTATUS/,
    );
  });

  // checkTimer -> checkHasMandatoryOptions(TIMER)
  test("Timer missing TIMER", async () => {
    const { diagnostics } = cicsPreprocessor.parse("CHECK STATUS(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TIMER/);
  });

  // checkDuplicates (warning severity)
  test("Duplicated ACTIVITY", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CHECK ACTIVITY(1) ACTIVITY(2) COMPSTATUS(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ACTIVITY/,
    );
  });
});
