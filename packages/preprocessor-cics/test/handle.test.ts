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

describe("CICS HANDLE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (ABEND)", () => {
    const { diagnostics } = cicsPreprocessor.parse("HANDLE ABEND PROGRAM(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "HANDLE ABEND PROGRAM(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkHandleAbend -> checkHasMutuallyExclusiveOptions
  test("ABEND mutually exclusive CANCEL and PROGRAM", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "HANDLE ABEND CANCEL PROGRAM(1)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: CANCEL or PROGRAM or LABEL or RESET/,
    );
  });

  // checkHandleCondition -> checkHasNormalCondition
  test("CONDITION NORMAL is illegal", () => {
    const { diagnostics } = cicsPreprocessor.parse("HANDLE CONDITION NORMAL");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: NORMAL/);
  });

  // checkHandleAid -> checkHasMandatoryOptions(AID)
  test("AID missing AID", () => {
    const { diagnostics } = cicsPreprocessor.parse("HANDLE PF1");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: AID/);
  });

  // checkDuplicates
  test("Duplicated ABEND", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "HANDLE ABEND ABEND PROGRAM(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ABEND/,
    );
  });
});
