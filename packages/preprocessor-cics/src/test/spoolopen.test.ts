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

describe("CICS SPOOLOPEN", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (INPUT)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN INPUT TOKEN(1) USERID(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN INPUT TOKEN(1) USERID(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkSpoolopenInput -> checkHasMandatoryOptions(TOKEN)
  test("INPUT missing TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN INPUT USERID(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TOKEN/);
  });

  // checkSpoolopenOutput -> checkHasMandatoryOptions(NODE)
  test("OUTPUT missing NODE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN OUTPUT TOKEN(1) USERID(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: NODE/);
  });

  // checkSpoolopenOutput -> checkHasMutuallyExclusiveOptions
  test("OUTPUT mutually exclusive NOCC and ASA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN OUTPUT TOKEN(1) USERID(2) NODE(3) NOCC ASA",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: NOCC, ASA, or MCC/,
    );
  });

  // checkDuplicates
  test("Duplicated TOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SPOOLOPEN INPUT TOKEN(1) TOKEN(2) USERID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TOKEN/,
    );
  });
});
