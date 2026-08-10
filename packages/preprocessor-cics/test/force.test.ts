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

describe("CICS FORCE TIMER", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse("FORCE TIMER(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORCE TIMER(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkOpts -> checkHasMandatoryOptions(TIMER)
  test("Missing TIMER", async () => {
    const { diagnostics } = cicsPreprocessor.parse("FORCE ACQACTIVITY");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TIMER/);
  });

  // checkOpts -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive ACQACTIVITY and ACQPROCESS", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORCE TIMER(123) ACQACTIVITY ACQPROCESS",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: ACQACTIVITY or ACQPROCESS/,
    );
  });

  // checkDuplicates
  test("Duplicated TIMER", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORCE TIMER(123) TIMER(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TIMER/,
    );
  });
});
