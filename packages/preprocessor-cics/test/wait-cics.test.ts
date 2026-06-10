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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS WAITCICS", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS ECBLIST(123) NUMEVENTS(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS ECBLIST(123) NUMEVENTS(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkWaitCics -> checkHasMandatoryOptions(ECBLIST)
  test("Missing ECBLIST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS NUMEVENTS(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ECBLIST/);
  });

  // checkWaitCics -> checkHasMandatoryOptions(NUMEVENTS)
  test("Missing NUMEVENTS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS ECBLIST(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: NUMEVENTS/,
    );
  });

  // checkWaitCics -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive PURGEABLE and NOTPURGEABLE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS ECBLIST(123) NUMEVENTS(2) PURGEABLE NOTPURGEABLE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: PURGEABLE or NOTPURGEABLE or PURGEABILITY/,
    );
  });

  // checkDuplicates
  test("Duplicated ECBLIST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WAITCICS ECBLIST(123) ECBLIST(456) NUMEVENTS(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ECBLIST/,
    );
  });
});
