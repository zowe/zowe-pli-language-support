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

describe("CICS DEFINE", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (ACTIVITY)", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "DEFINE ACTIVITY(1) TRANSID(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Define timer", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE TIMER('TIMER1')",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Unexpected end of file/);
    expect(diagnostics[1].severity).toBe(Severity.Error);
    expect(diagnostics[1].message).toMatch(
      /Missing required option: AFTER or AT/,
    );
  });

  test("Define timer with aggregated missing options on missing year", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE TIMER('TIMER1') AT HOURS(1) ON",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: YEAR/);
  });

  test("Define timer with aggregated missing options on missing month", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DEFINE TIMER('TIMER1') AT HOURS(1) ON YEAR(2026)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: DAYOFMONTH or MONTH/,
    );
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "DEFINE ACTIVITY(1) TRANSID(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkActivity -> checkHasMandatoryOptions(TRANSID)
  test("ACTIVITY missing TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "DEFINE ACTIVITY(1) PROGRAM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TRANSID/);
  });

  // checkCompositeEvent -> checkHasExactlyOneOption (AND or OR none)
  test("COMPOSITE without AND or OR", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "DEFINE COMPOSITE EVENT(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: AND or OR/,
    );
  });

  // checkDuplicates
  test("Duplicated TRANSID", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "DEFINE ACTIVITY(1) TRANSID(2) TRANSID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TRANSID/,
    );
  });
});
