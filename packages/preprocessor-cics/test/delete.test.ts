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

describe("CICS DELETE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (group one)", () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETE FILE(1) RIDFLD(2)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELETE FILE(1) RIDFLD(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDeleteGroupOne -> checkHasMandatoryOptions(cics_file_name)
  test("Group one missing FILE", () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETE TOKEN(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FILE/);
  });

  // checkDeleteGroupOne -> checkHasIllegalOptions(KEYLENGTH) when RIDFLD absent
  test("Group one KEYLENGTH illegal without RIDFLD", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELETE FILE(1) KEYLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: KEYLENGTH/,
    );
  });

  // checkDeleteGroupThree -> checkHasMandatoryOptions(CONTAINER)
  test("Group three missing CONTAINER", () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETE ACQPROCESS");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: CONTAINER/,
    );
  });

  // checkDeleteGroupFour -> checkHasExactlyOneOption (none provided)
  test("Group four without COUNTER or DCOUNTER", () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETE POOL(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: COUNTER or DCOUNTER/,
    );
  });

  // checkDuplicates
  test("Duplicated RIDFLD", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELETE FILE(1) RIDFLD(2) RIDFLD(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: RIDFLD/,
    );
  });
});
