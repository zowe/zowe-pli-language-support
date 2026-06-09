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

describe("CICS READQ", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (TD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READQ TD QUEUE(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READQ TD QUEUE(1) INTO(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkTd -> checkHasMandatoryOptions(QUEUE)
  test("TD missing QUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("READQ TD INTO(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: QUEUE/);
  });

  // checkTd -> checkHasIllegalOptions(NEXT)
  test("TD illegal NEXT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READQ TD QUEUE(1) INTO(2) NEXT",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: NEXT/);
  });

  // checkTs -> checkHasExactlyOneOption (QUEUE or QNAME none)
  test("TS without QUEUE or QNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("READQ TS INTO(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: QUEUE or QNAME/,
    );
  });

  // checkDuplicates
  test("Duplicated QUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "READQ TD QUEUE(1) QUEUE(2) INTO(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: QUEUE/,
    );
  });
});
