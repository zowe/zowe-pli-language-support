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

describe("CICS PUT CONTAINER", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("PUT CONTAINER(1) FROM(2)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "PUT CONTAINER(1) FROM(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkBTS -> checkHasMandatoryOptions(FROM)
  test("Missing FROM", () => {
    const { diagnostics } = cicsPreprocessor.parse("PUT CONTAINER(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkBTS -> checkMutuallyExclusiveOptions
  test("Mutually exclusive ACTIVITY and ACQACTIVITY", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "PUT ACTIVITY(1) ACQACTIVITY CONTAINER(2) FROM(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "ACTIVITY, ACQACTIVITY, PROCESS or ACQPROCESS" are mutually exclusive/,
    );
  });

  // checkOptions -> checkHasIllegalOptions(PUT64)
  test("PUT64 is only available in Assembly", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "PUT64 CONTAINER(1) FROM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: PUT64 is only available in Assembly/,
    );
  });

  // checkDuplicates
  test("Duplicated CONTAINER", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "PUT CONTAINER(1) CONTAINER(2) FROM(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONTAINER/,
    );
  });
});
