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

describe("CICS RESUME", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("RESUME ACTIVITY(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("RESUME ACTIVITY(123) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkBody -> checkHasExactlyOneOption (none provided)
  test("None of ACQACTIVITY/ACQPROCESS/ACTIVITY", () => {
    const { diagnostics } = cicsPreprocessor.parse("RESUME NOHANDLE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ACQACTIVITY, ACQPROCESS or ACTIVITY/,
    );
  });

  // checkBody -> checkHasExactlyOneOption (multiple -> mutually exclusive)
  test("Both ACQACTIVITY and ACQPROCESS", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RESUME ACQACTIVITY ACQPROCESS",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: ACQACTIVITY, ACQPROCESS or ACTIVITY/,
    );
  });

  // checkDuplicates
  test("Duplicated ACQACTIVITY", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RESUME ACQACTIVITY ACQACTIVITY",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ACQACTIVITY/,
    );
  });
});
