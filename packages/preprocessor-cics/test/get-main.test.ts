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

describe("CICS GETMAIN", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("GETMAIN SET(1) FLENGTH(2)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "GETMAIN SET(1) FLENGTH(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkGetMain -> checkHasMandatoryOptions(SET)
  test("Missing SET", () => {
    const { diagnostics } = cicsPreprocessor.parse("GETMAIN FLENGTH(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SET/);
  });

  // checkGetMain -> checkHasExactlyOneOption (none provided)
  test("Neither FLENGTH nor LENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse("GETMAIN SET(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FLENGTH or LENGTH/,
    );
  });

  // checkGetMain -> checkHasIllegalOptions(BELOW) when FLENGTH absent
  test("BELOW without FLENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "GETMAIN SET(1) LENGTH(2) BELOW",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: BELOW without FLENGTH/,
    );
  });

  // checkDuplicates (SET is not in the duplicate map; FLENGTH is)
  test("Duplicated FLENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "GETMAIN SET(1) FLENGTH(2) FLENGTH(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FLENGTH/,
    );
  });
});
