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

describe("CICS ALLOCATE", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (PARTNER)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE PARTNER(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Alone allocate", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("ALLOCATE");
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Unexpected end of file/);
    expect(diagnostics[1].severity).toBe(Severity.Error);
    expect(diagnostics[1].message).toMatch(
      /Must include one or more of the following: SESSION, SYSID, PARTNER/,
    );
  });

  test("Positive (SYSID)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE SYSID(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ALLOCATE PARTNER(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAppcPartner -> checkHasMandatoryOptions(PARTNER)
  test("Missing PARTNER", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE NOQUEUE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PARTNER/);
  });

  // checkDuplicates
  test("Duplicated PARTNER", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ALLOCATE PARTNER(1) PARTNER(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PARTNER/,
    );
  });
});
