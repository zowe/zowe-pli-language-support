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

describe("CICS START", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (TRANSID)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("START TRANSID(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "START TRANSID(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkStartTransid -> checkHasMandatoryOptions(TRANSID)
  test("Transid missing TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("START FROM(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TRANSID/);
  });

  // checkStartTransid -> checkMutuallyExclusiveOptions
  test("Mutually exclusive INTERVAL and TIME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "START TRANSID(1) INTERVAL(123) TIME(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "INTERVAL, AFTER, AT or TIME" are mutually exclusive/,
    );
  });

  // checkStartAttach -> checkHasMandatoryOptions(TRANSID)
  test("ATTACH missing TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("START ATTACH");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TRANSID/);
  });

  // checkDuplicates
  test("Duplicated TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "START TRANSID(1) TRANSID(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TRANSID/,
    );
  });
});
