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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS SIGNON", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SIGNON USERID(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNON USERID(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkMainBody -> checkHasMandatoryOptions(USERID)
  test("Body missing USERID", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SIGNON PASSWORD(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: USERID/);
  });

  // checkMainBody -> checkPrerequisiteIsMet
  test("NEWPASSWORD without PASSWORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNON USERID(1) NEWPASSWORD(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option for: NEWPASSWORD without PASSWORD/,
    );
  });

  // checkToken -> checkHasMandatoryOptions(TOKENLEN)
  test("Token missing TOKENLEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNON KERBEROS TOKEN(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: TOKENLEN/);
  });

  // checkDuplicates
  test("Duplicated USERID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNON USERID(1) USERID(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: USERID/,
    );
  });
});
