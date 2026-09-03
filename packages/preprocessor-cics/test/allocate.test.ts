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

describe("CICS ALLOCATE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (PARTNER)", () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE PARTNER(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Alone allocate", () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: SESSION, SYSID, PARTNER/,
    );
  });

  test("Positive (SYSID)", () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE SYSID(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE PARTNER(1) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAppcPartner -> checkHasMandatoryOptions(PARTNER)
  test("Missing PARTNER", () => {
    const { diagnostics } = cicsPreprocessor.parse("ALLOCATE NOQUEUE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PARTNER/);
  });

  // checkDuplicates
  test("Duplicated PARTNER", () => {
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
