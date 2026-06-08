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

describe("CICS RESET", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (ACQPROCESS)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RESET ACQPROCESS");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RESET ACQPROCESS BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkResetAcqprocess -> checkHasMandatoryOptions(ACQPROCESS)
  test("Missing ACQPROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RESET NOHANDLE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: ACQPROCESS/,
    );
  });

  // checkDuplicates
  test("Duplicated ACTIVITY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RESET ACTIVITY(1) ACTIVITY(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ACTIVITY/,
    );
  });
});
