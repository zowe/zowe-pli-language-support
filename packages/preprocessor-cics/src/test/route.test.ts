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

describe("CICS ROUTE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ROUTE AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ROUTE AFTER HOURS(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkRule -> checkMutuallyExclusiveOptions
  test("Mutually exclusive INTERVAL and TIME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ROUTE INTERVAL(0) TIME(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "INTERVAL, TIME, AFTER or AT" are mutually exclusive/,
    );
  });

  // checkRule -> checkHasAtLeastOneOption when AFTER/AT present
  test("AFTER without HOURS/MINUTES/SECONDS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ROUTE AFTER");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Must include one or more of the following: HOURS, MINUTES or SECONDS/,
    );
  });

  // checkDuplicates (warning severity)
  test("Duplicated AFTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "ROUTE AFTER AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: AFTER/,
    );
  });
});
