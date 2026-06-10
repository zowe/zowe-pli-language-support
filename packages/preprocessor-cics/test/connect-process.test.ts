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

describe("CICS CONNECT PROCESS", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONNECT PROCESS CONVID(1) PROCNAME(2) SYNCLEVEL(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONNECT PROCESS CONVID(1) PROCNAME(2) SYNCLEVEL(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkConnectProcessOptions -> checkHasExactlyOneOption (none provided)
  test("Neither CONVID nor SESSION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONNECT PROCESS SYNCLEVEL(3) PROCNAME(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: CONVID or SESSION/,
    );
  });

  // checkConnectProcessOptions -> checkHasMandatoryOptions(SYNCLEVEL)
  test("Missing SYNCLEVEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONNECT PROCESS CONVID(1) PROCNAME(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: SYNCLEVEL/,
    );
  });

  // checkDuplicates
  test("Duplicated CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "CONNECT PROCESS CONVID(1) CONVID(2) PROCNAME(3) SYNCLEVEL(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONVID/,
    );
  });
});
