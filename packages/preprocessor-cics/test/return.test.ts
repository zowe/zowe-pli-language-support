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

describe("CICS RETURN", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RETURN TRANSID(123) COMMAREA(456) LENGTH(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("RETURN BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkRule -> checkPrerequisiteIsMet
  test("COMMAREA without TRANSID", () => {
    const { diagnostics } = cicsPreprocessor.parse("RETURN COMMAREA(456)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option for: COMMAREA without TRANSID/,
    );
  });

  // checkRule -> checkMutuallyExclusiveOptions
  test("Mutually exclusive COMMAREA and CHANNEL", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RETURN TRANSID(123) COMMAREA(456) CHANNEL(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "COMMAREA or CHANNEL" are mutually exclusive/,
    );
  });

  // checkRule -> checkOptionalWithLength (optional present without required field)
  test("LENGTH without COMMAREA", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RETURN TRANSID(123) LENGTH(5)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: LENGTH without COMMAREA/,
    );
  });

  // checkDuplicates
  test("Duplicated TRANSID", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "RETURN TRANSID(123) TRANSID(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: TRANSID/,
    );
  });
});
