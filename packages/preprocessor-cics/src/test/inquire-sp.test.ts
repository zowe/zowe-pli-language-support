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

describe("CICS INQUIRE (system programming)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (STORAGE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE STORAGE ADDRESS(AD)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE STORAGE ADDRESS(AD) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // storage -> checkHasExactlyOneOption(ADDRESS or NUMELEMENTS)
  test("STORAGE without ADDRESS or NUMELEMENTS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("INQUIRE STORAGE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ADDRESS or NUMELEMENTS/,
    );
  });

  // tracetype -> checkHasExactlyOneOption(FLAGSET or SPECIAL or STANDARD)
  test("TRACETYPE without FLAGSET/SPECIAL/STANDARD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("INQUIRE TRACETYPE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FLAGSET or SPECIAL or STANDARD/,
    );
  });

  // mvstcb -> checkHasExactlyOneOption(START or END or NEXT)
  test("MVSTCB without START/END/NEXT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("INQUIRE MVSTCB");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: START or END or NEXT/,
    );
  });

  // enq -> checkHasIllegalOptions(RESLEN) without RESOURCE
  test("ENQ RESLEN without RESOURCE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE ENQ START RESLEN(RL)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: RESLEN without RESOURCE/,
    );
  });

  // association_list -> checkHasMandatoryOptions(LISTSIZE)
  test("ASSOCIATION LIST missing LISTSIZE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE ASSOCIATION LIST",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: LISTSIZE/);
  });

  // vtam -> checkHasMutuallyExclusiveOptions(PSDINTERVAL/PSDINTHRS)
  test("VTAM PSDINTERVAL and PSDINTHRS mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE VTAM PSDINTERVAL(PI) PSDINTHRS(PH)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: PSDINTHRS with PSDINTERVAL/,
    );
  });

  // checkDuplicates
  test("Duplicated ADDRESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE STORAGE ADDRESS(AD) ADDRESS(AD2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADDRESS/,
    );
  });
});
