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

describe("CICS INVOKE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (APPLICATION)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE APPLICATION(123) OPERATION(456)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE APPLICATION(123) OPERATION(456) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkInvokeApplication -> checkHasMandatoryOptions(OPERATION)
  test("APPLICATION missing OPERATION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE APPLICATION(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: OPERATION/,
    );
  });

  // checkInvokeApplication -> MAJORVERSION mandatory when MINORVERSION present
  test("MINORVERSION without MAJORVERSION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE APPLICATION(123) OPERATION(456) MINORVERSION(7)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: MAJORVERSION/,
    );
  });

  // checkInvokeService -> checkHasExactlyOneOption (both -> mutually exclusive)
  test("SERVICE: both SERVICE and WEBSERVICE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE SERVICE(1) WEBSERVICE(2) CHANNEL(3) OPERATION(4)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: SERVICE or WEBSERVICE/,
    );
  });

  // checkDuplicates
  test("Duplicated APPLICATION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INVOKE APPLICATION(123) APPLICATION(456) OPERATION(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: APPLICATION/,
    );
  });
});
