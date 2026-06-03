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

describe("CICS COLLECT STATISTICS", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "COLLECT STATISTICS SET(1) MONITOR",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "COLLECT STATISTICS SET(1) MONITOR BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkOpts -> checkHasMandatoryOptions(SET)
  test("Missing SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "COLLECT STATISTICS MONITOR",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SET/);
  });

  // checkOpts -> big mutually-exclusive resource list
  test("Mutually exclusive MONITOR and FILE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "COLLECT STATISTICS SET(1) MONITOR FILE(2)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive:/,
    );
  });

  // checkDuplicates
  test("Duplicated SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "COLLECT STATISTICS SET(1) SET(2) MONITOR",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: SET/,
    );
  });
});
