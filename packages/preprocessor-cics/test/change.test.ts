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

describe("CICS CHANGE", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive (PASSWORD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CHANGE PASSWORD(1) NEWPASSWORD(2) USERID(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CHANGE PASSWORD(1) NEWPASSWORD(2) USERID(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkChangePassword -> checkHasMandatoryOptions(NEWPASSWORD)
  test("PASSWORD missing NEWPASSWORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CHANGE PASSWORD(1) USERID(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: NEWPASSWORD/,
    );
  });

  // checkChangePhrase -> checkHasMandatoryOptions(USERID)
  test("PHRASE missing USERID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CHANGE PHRASE(1) NEWPHRASE(2) NEWPHRASELEN(3) PHRASELEN(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: USERID/);
  });

  // checkDuplicates
  test("Duplicated PASSWORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CHANGE PASSWORD(1) PASSWORD(2) NEWPASSWORD(3) USERID(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PASSWORD/,
    );
  });
});
