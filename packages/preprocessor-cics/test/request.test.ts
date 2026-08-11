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

describe("CICS REQUEST", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "REQUEST ENCRYPTPTKT(1) FLENGTH(2) ENCRYPTKEY(3) ESMAPPNAME(4)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "REQUEST ENCRYPTPTKT(1) FLENGTH(2) ENCRYPTKEY(3) ESMAPPNAME(4) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkRequestBody -> checkHasExactlyOneOption (none provided)
  test("Neither ENCRYPTPTKT nor PASSTICKET", () => {
    const { diagnostics } = cicsPreprocessor.parse("REQUEST FLENGTH(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ENCRYPTPTKT or PASSTICKET/,
    );
  });

  // checkRequestBody -> ENCRYPTPTKT requires FLENGTH
  test("ENCRYPTPTKT missing FLENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "REQUEST ENCRYPTPTKT(1) ENCRYPTKEY(2) ESMAPPNAME(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FLENGTH/);
  });

  // checkDuplicates
  test("Duplicated FLENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "REQUEST ENCRYPTPTKT(1) FLENGTH(2) FLENGTH(3) ENCRYPTKEY(4) ESMAPPNAME(5)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FLENGTH/,
    );
  });
});
