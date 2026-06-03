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

describe("CICS REWIND COUNTER", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWIND COUNTER(123)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWIND COUNTER(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkOpts -> checkHasExactlyOneOption (none provided)
  test("Neither COUNTER nor DCOUNTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("REWIND NOSUSPEND");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: COUNTER or DCOUNTER/,
    );
  });

  // checkOpts -> checkHasExactlyOneOption (both provided -> mutually exclusive)
  test("Both COUNTER and DCOUNTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWIND COUNTER(123) DCOUNTER(456)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: COUNTER or DCOUNTER/,
    );
  });

  // checkDuplicates
  test("Duplicated POOL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "REWIND COUNTER(123) POOL(1) POOL(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: POOL/,
    );
  });
});
