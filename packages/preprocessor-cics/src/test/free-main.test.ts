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

describe("CICS FREEMAIN", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("FREEMAIN DATA(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FREEMAIN DATA(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkOpts -> checkHasIllegalOptions(FREEMAIN64)
  test("FREEMAIN64 is illegal", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FREEMAIN64 DATA(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: FREEMAIN64 is only available in Assembly/,
    );
  });

  // checkOpts -> checkHasExactlyOneOption (none provided)
  test("Neither DATA nor DATAPOINTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("FREEMAIN NOHANDLE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: DATA or DATAPOINTER/,
    );
  });

  // checkOpts -> checkHasExactlyOneOption (both provided -> mutually exclusive)
  test("Both DATA and DATAPOINTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FREEMAIN DATA(123) DATAPOINTER(456)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: DATA or DATAPOINTER/,
    );
  });

  // checkDuplicates
  test("Duplicated DATA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "FREEMAIN DATA(123) DATA(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DATA/,
    );
  });
});
