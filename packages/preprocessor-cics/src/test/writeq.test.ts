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

describe("CICS WRITEQ", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (TD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITEQ TD QUEUE(1) FROM(2)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITEQ TD QUEUE(1) FROM(2) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /Syntax error on 'BLA', expected <EOF>/,
    );
  });

  // checkWriteqTd -> checkHasMandatoryOptions(QUEUE)
  test("TD missing QUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WRITEQ TD FROM(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: QUEUE/);
  });

  // checkWriteqTs -> checkHasExactlyOneOption (none provided)
  test("TS without QUEUE or QNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WRITEQ TS FROM(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: QUEUE or QNAME/,
    );
  });

  // checkWriteqTs -> checkHasMutuallyExclusiveOptions
  test("TS mutually exclusive NUMITEMS and ITEM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITEQ TS QUEUE(1) FROM(2) NUMITEMS(3) ITEM(4)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: NUMITEMS or ITEM/,
    );
  });

  // checkDuplicates
  test("Duplicated QUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITEQ TD QUEUE(1) QUEUE(2) FROM(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: QUEUE/,
    );
  });
});
