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

describe("CICS FORMATTIME", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME ABSTIME(123)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME ABSTIME(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkOpts -> checkHasMandatoryOptions(ABSTIME)
  test("Missing ABSTIME", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME DATE(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: ABSTIME/);
  });

  // checkOpts -> DATESTRING becomes mandatory when STRINGZONE is present
  test("STRINGZONE without DATESTRING", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME ABSTIME(123) STRINGZONE(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: DATESTRING/,
    );
  });

  // checkOpts -> TIME becomes mandatory when TIMESEP is present
  test("TIMESEP without TIME", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME ABSTIME(123) TIMESEP(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TIME/);
  });

  // checkDuplicates
  test("Duplicated ABSTIME", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FORMATTIME ABSTIME(123) ABSTIME(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ABSTIME/,
    );
  });
});
