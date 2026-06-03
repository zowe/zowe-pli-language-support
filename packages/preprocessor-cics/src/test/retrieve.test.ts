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

describe("CICS RETRIEVE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (standard)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RETRIEVE INTO(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RETRIEVE INTO(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkRetrieveStandard -> checkHasExactlyOneOption (none provided)
  test("Standard without INTO or SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RETRIEVE WAIT");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO or SET/,
    );
  });

  // checkRetrieveStandard -> SET requires LENGTH
  test("SET requires LENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RETRIEVE SET(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: LENGTH/);
  });

  // checkRetrieveReattach -> checkHasMandatoryOptions(EVENT)
  test("REATTACH missing EVENT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RETRIEVE REATTACH");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: EVENT/);
  });

  // checkDuplicates
  test("Duplicated INTO", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RETRIEVE INTO(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: INTO/,
    );
  });
});
