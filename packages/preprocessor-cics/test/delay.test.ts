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

describe("CICS DELAY", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse("DELAY FOR HOURS(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELAY FOR HOURS(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkOpts -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive INTERVAL and TIME", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELAY INTERVAL(0) TIME(123)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: INTERVAL, TIME, UNTIL, FOR/,
    );
  });

  // checkOpts -> checkHasIllegalOptions when INTERVAL is present
  test("HOURS illegal with INTERVAL", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELAY INTERVAL(0) HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: HOURS/);
  });

  // checkOpts -> mandatory HOURS/MINUTES/SECONDS when UNTIL is present
  test("UNTIL without HOURS/MINUTES/SECONDS", async () => {
    const { diagnostics } = cicsPreprocessor.parse("DELAY UNTIL");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: HOURS or MINUTES or SECONDS/,
    );
  });

  // checkDuplicates
  test("Duplicated HOURS", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELAY FOR HOURS(1) HOURS(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: HOURS/,
    );
  });
});
