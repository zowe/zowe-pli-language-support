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

describe("CICS STARTBR", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("STARTBR FILE(1) RIDFLD(2)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "STARTBR FILE(1) RIDFLD(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkStartbr -> checkHasMandatoryOptions(RIDFLD)
  test("Missing RIDFLD", () => {
    const { diagnostics } = cicsPreprocessor.parse("STARTBR FILE(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RIDFLD/);
  });

  // checkStartbr -> KEYLENGTH mandatory when GENERIC present
  test("GENERIC without KEYLENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "STARTBR FILE(1) RIDFLD(2) GENERIC",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: KEYLENGTH/,
    );
  });

  // checkStartbr -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive GTEQ and EQUAL", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "STARTBR FILE(1) RIDFLD(2) GTEQ EQUAL",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: GTEQ or EQUAL/,
    );
  });

  // checkDuplicates
  test("Duplicated REQID", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "STARTBR FILE(1) RIDFLD(2) REQID(3) REQID(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: REQID/,
    );
  });
});
