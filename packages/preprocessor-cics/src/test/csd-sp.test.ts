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

describe("CICS CSD (SP)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (ADD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(L) GROUP(G)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(L) GROUP(G) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkAdd -> checkHasMandatoryOptions(GROUP)
  test("ADD missing GROUP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(L)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: GROUP/);
  });

  // checkAdd -> checkHasMutuallyExclusiveOptions(BEFORE or AFTER)
  test("ADD BEFORE and AFTER mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD LIST(L) GROUP(G) BEFORE(B) AFTER(A)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: BEFORE or AFTER/,
    );
  });

  // checkAlter -> checkHasMandatoryOptions(RESID)
  test("ALTER missing RESID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ALTER GROUP(G) ATTRIBUTES(A) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RESID/);
  });

  // checkCopy -> checkHasExactlyOneOption(AS or TO)
  test("COPY without AS or TO", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD COPY GROUP(G)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: AS or TO/,
    );
  });

  // checkGetNextRsrce -> MISSING_ATTRBUTES_OR_SET custom throw
  test("GETNEXTRSRCE ATTRLEN without ATTRIBUTES or SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD GETNEXTRSRCE RESTYPE(X) RESID(R) GROUP(G) ATTRLEN(L)",
    );
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option for ATTRLEN: ATTRIBUTES or SET/,
    );
  });

  // checkInstall -> checkHasIllegalOptions(cvda) when LIST present
  test("INSTALL LIST with resource cvda", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD INSTALL LIST(L) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: RESTYPE or ATOMSERVICE/,
    );
  });

  // checkDuplicates
  test("Duplicated ADD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CSD ADD ADD LIST(L) GROUP(G)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADD/,
    );
  });
});
