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

// NOTE: GETMAIN64 is only valid in Assembly, so the checker always reports the
// GETMAIN64 keyword as illegal. Every command therefore carries that baseline
// diagnostic; the tests assert it and any additional branch-specific errors.
describe("CICS GETMAIN64", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  // checkGetMain -> checkHasIllegalOptions(GETMAIN64)
  test("GETMAIN64 is only available in Assembly", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETMAIN64 SET(1) FLENGTH(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: GETMAIN64 is only available in Assembly/,
    );
  });

  // checkGetMain -> checkHasMandatoryOptions(SET) (plus the GETMAIN64 baseline)
  test("Missing SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETMAIN64 FLENGTH(1)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(
      diagnostics.some((d) => /Missing required option: SET/.test(d.message)),
    ).toBe(true);
  });

  // checkGetMain -> checkHasMandatoryOptions(FLENGTH) (plus the GETMAIN64 baseline)
  test("Missing FLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("GETMAIN64 SET(1)");
    expect(diagnostics).toHaveLength(2);
    expect(
      diagnostics.some((d) =>
        /Missing required option: FLENGTH/.test(d.message),
      ),
    ).toBe(true);
  });

  // checkGetMain -> checkHasIllegalOptions(EXECUTABLE) when LOCATION absent
  test("EXECUTABLE without LOCATION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "GETMAIN64 SET(1) FLENGTH(2) EXECUTABLE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(
      diagnostics.some((d) =>
        /Invalid option provided: EXECUTABLE without LOCATION/.test(d.message),
      ),
    ).toBe(true);
  });
});
