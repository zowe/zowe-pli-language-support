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

describe("CICS ROUTE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("ROUTE AFTER HOURS(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("ROUTE AFTER HOURS(1) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkRule -> checkMutuallyExclusiveOptions
  test("Mutually exclusive INTERVAL and TIME", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ROUTE INTERVAL(0) TIME(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "INTERVAL, TIME, AFTER or AT" are mutually exclusive/,
    );
  });

  // checkRule -> checkHasAtLeastOneOption when AFTER/AT present
  test("AFTER without HOURS/MINUTES/SECONDS", () => {
    const { diagnostics } = cicsPreprocessor.parse("ROUTE AFTER");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Must include one or more of the following: HOURS, MINUTES or SECONDS/,
    );
  });

  // checkDuplicates (warning severity)
  test("Duplicated AFTER", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ROUTE AFTER AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: AFTER/,
    );
  });
});
