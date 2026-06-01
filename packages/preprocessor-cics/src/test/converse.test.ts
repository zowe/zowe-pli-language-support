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

describe("CICS CONVERSE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE FROM(1) FROMLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE FROM(1) FROMLENGTH(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkRule -> checkHasMandatoryOptions(FROM) when FROMLENGTH present
  test("FROMLENGTH without FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE FROMLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkRule -> checkHasIllegalOptions(LEAVEKB) when ASIS present
  test("LEAVEKB illegal with ASIS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE ASIS LEAVEKB",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: LEAVEKB/);
  });

  // checkDuplicates -> custom duplicate rule (FROMLENGTH or FROMFLENGTH)
  test("Duplicated FROMLENGTH rule", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE FROM(1) FROMLENGTH(2) FROMFLENGTH(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "FROMLENGTH or FROMFLENGTH" cannot be used more than once in a given command/,
    );
  });

  // checkDuplicates
  test("Duplicated CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONVERSE CONVID(1) CONVID(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONVID/,
    );
  });
});
