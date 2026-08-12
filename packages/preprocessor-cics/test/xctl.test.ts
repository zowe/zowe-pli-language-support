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

describe("CICS XCTL", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("XCTL PROGRAM(P)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("XCTL PROGRAM(P) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkXctl -> checkHasMandatoryOptions
  test("Missing PROGRAM", () => {
    const { diagnostics } = cicsPreprocessor.parse("XCTL COMMAREA(A)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkXctl -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive COMMAREA and CHANNEL", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "XCTL PROGRAM(P) COMMAREA(A) CHANNEL(C)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: COMMAREA or CHANNEL/,
    );
  });

  // checkXctl -> checkOptionalWithLength (optional present without its required field)
  test("LENGTH without COMMAREA", () => {
    const { diagnostics } = cicsPreprocessor.parse("XCTL PROGRAM(P) LENGTH(5)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: LENGTH without COMMAREA/,
    );
  });

  // checkDuplicates
  test("Duplicated PROGRAM", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "XCTL PROGRAM(P) PROGRAM(Q)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
