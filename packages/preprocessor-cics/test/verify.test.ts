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

describe("CICS VERIFY", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive (PASSWORD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "VERIFY PASSWORD(1) USERID(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "VERIFY PASSWORD(1) USERID(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkVerifyPassword -> checkHasMandatoryOptions(USERID)
  test("PASSWORD missing USERID", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("VERIFY PASSWORD(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: USERID/);
  });

  // checkVerifyToken -> checkHasExactlyOneOption (none provided)
  test("Token without TOKENTYPE/BASICAUTH/JWT/KERBEROS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "VERIFY TOKEN(1) TOKENLEN(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: TOKENTYPE or BASICAUTH or JWT or KERBEROS/,
    );
  });

  // checkDuplicates
  test("Duplicated PASSWORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "VERIFY PASSWORD(1) PASSWORD(2) USERID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PASSWORD/,
    );
  });
});
