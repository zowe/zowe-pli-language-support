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

describe("CICS EXTRACT (SP)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (EXIT)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT EXIT PROGRAM(1) GALENGTH(LEN) GASET(PTR)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT EXIT PROGRAM(1) GALENGTH(LEN) GASET(PTR) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkExtractExit -> checkHasMandatoryOptions(PROGRAM)
  test("EXIT missing PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT EXIT GALENGTH(LEN) GASET(PTR)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkExtractStatistics -> checkHasMandatoryOptions(SET)
  test("STATISTICS missing SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT STATISTICS MONITOR",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SET/);
  });

  // checkRestypeOptions -> multiple RESTYPE options not allowed
  test("Multiple RESTYPE options", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT STATISTICS MONITOR FILE SET(PTR)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Multiple RESTYPE options are not allowed/,
    );
  });

  // checkForResidRequiredOptions -> RESIDLEN without RESID
  test("RESIDLEN without RESID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT STATISTICS MONITOR SET(PTR) RESIDLEN(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: RESIDLEN without RESID/,
    );
  });

  // checkLastTimeOptions -> LASTRESETABS with LASTRESET
  test("LASTRESET with LASTRESETABS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT STATISTICS MONITOR SET(PTR) LASTRESET(X) LASTRESETABS(Y)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: LASTRESET(ABS with LASTRESET| with LASTRESETABS)/,
    );
  });

  // checkDuplicates
  test("Duplicated SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "EXTRACT STATISTICS MONITOR SET(PTR) SET(PTR2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: SET/,
    );
  });
});
