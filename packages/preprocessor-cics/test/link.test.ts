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

describe("CICS LINK", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("LINK PROGRAM(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LINK PROGRAM(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkLinkProgram -> checkHasMandatoryOptions(PROGRAM)
  test("PROGRAM missing", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("LINK SYSID(123)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkLinkProgram -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive COMMAREA and CHANNEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LINK PROGRAM(123) COMMAREA(4) CHANNEL(5)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: COMMAREA or CHANNEL/,
    );
  });

  // checkLinkActivity -> checkHasExactlyOneOption (both -> mutually exclusive)
  test("ACTIVITY and ACQACTIVITY mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LINK ACTIVITY(1) ACQACTIVITY",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: ACTIVITY or ACQACTIVITY/,
    );
  });

  // checkDuplicates
  test("Duplicated PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "LINK PROGRAM(1) PROGRAM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
