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

describe("CICS CREATE (SP)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE PROGRAM(1) ATTRIBUTES(AREA)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE PROGRAM(1) ATTRIBUTES(AREA) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkOpts -> checkHasExactlyOneOption(resource) none provided
  test("No resource option", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE ATTRIBUTES(AREA)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ATOMSERVICE/,
    );
  });

  // CONNECTION/TERMINAL branch -> checkHasExactlyOneOption(ATTRIBUTES or COMPLETE or DISCARD)
  test("CONNECTION without ATTRIBUTES/COMPLETE/DISCARD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE CONNECTION(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: ATTRIBUTES or COMPLETE or DISCARD/,
    );
  });

  // else branch -> checkHasIllegalOptions(DISCARD) when no CONNECTION/TERMINAL
  test("DISCARD without CONNECTION/TERMINAL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE PROGRAM(1) DISCARD ATTRIBUTES(AREA)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: DISCARD/);
  });

  // checkDataValueCompleteDiscard -> operand value not allowed
  test("CONNECTION with value and DISCARD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE CONNECTION(1) DISCARD",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Operand value not allowed/);
  });

  // checkRequiredSubOperand -> operand value required
  test("CONNECTION without value and ATTRIBUTES", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE CONNECTION ATTRIBUTES(AREA)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Operand value required/);
  });

  // checkHasMutuallyExclusiveOptions(LOG or NOLOG or LOGMESSAGE)
  test("LOG and NOLOG mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE PROGRAM(1) ATTRIBUTES(AREA) LOG NOLOG",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: LOG or NOLOG or LOGMESSAGE/,
    );
  });

  // checkDuplicates
  test("Duplicated PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CREATE PROGRAM(1) PROGRAM(2) ATTRIBUTES(AREA)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
