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

describe("CICS FETCH", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FETCH ANY(1) COMPSTATUS(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FETCH ANY(1) COMPSTATUS(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkFetchAnyChild -> checkHasExactlyOneOption (none provided)
  test("Neither ANY nor CHILD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FETCH COMPSTATUS(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ANY or CHILD/,
    );
  });

  // checkFetchAnyChild -> checkHasMandatoryOptions(COMPSTATUS)
  test("Missing COMPSTATUS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("FETCH ANY(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: COMPSTATUS/,
    );
  });

  // checkFetchAnyChild -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive NOSUSPEND and TIMEOUT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FETCH ANY(1) COMPSTATUS(2) NOSUSPEND TIMEOUT(3)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: NOSUSPEND or TIMEOUT/,
    );
  });

  // checkDuplicates
  test("Duplicated CHANNEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FETCH ANY(1) COMPSTATUS(2) CHANNEL(3) CHANNEL(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CHANNEL/,
    );
  });
});
