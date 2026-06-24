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

describe("CICS POST", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST SET(123) AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST SET(123) AFTER HOURS(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkPost -> checkHasMandatoryOptions(SET)
  test("Missing SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SET/);
  });

  // checkPost -> mandatory HOURS/MINUTES/SECONDS when AFTER/AT present
  test("AFTER without HOURS/MINUTES/SECONDS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST SET(123) AFTER",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: HOURS or MINUTES or SECONDS/,
    );
  });

  // checkPost -> checkHasExactlyOneOption(AFTER or AT) when HOURS/MINUTES/SECONDS present
  test("HOURS without AFTER or AT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST SET(123) HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: AFTER or AT/,
    );
  });

  // checkDuplicates
  test("Duplicated SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POST SET(123) SET(456) AFTER HOURS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: SET/,
    );
  });
});
