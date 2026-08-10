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

describe("CICS QUERY", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (CHANNEL)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("QUERY CHANNEL(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "QUERY CHANNEL(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkQueryChannel -> checkHasMandatoryOptions(CHANNEL)
  test("Channel missing CHANNEL", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "QUERY CONTAINERCNT(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: CHANNEL/);
  });

  // checkQueryCounter -> checkHasExactlyOneOption (none provided)
  test("Counter without COUNTER or DCOUNTER", async () => {
    const { diagnostics } = cicsPreprocessor.parse("QUERY POOL(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: COUNTER or DCOUNTER/,
    );
  });

  // checkQuerySecurity -> checkHasMandatoryOptions(RESID)
  test("Security missing RESID", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "QUERY SECURITY RESTYPE(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RESID/);
  });

  // checkDuplicates
  test("Duplicated CHANNEL", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "QUERY CHANNEL(1) CHANNEL(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CHANNEL/,
    );
  });
});
