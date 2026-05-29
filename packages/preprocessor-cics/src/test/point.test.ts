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

describe("CICS POINT", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("POINT CONVID(A)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("POINT BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkPoint -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive CONVID and SESSION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POINT CONVID(A) SESSION(B)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: CONVID or SESSION/,
    );
  });

  // checkDuplicates
  test("Duplicated CONVID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "POINT CONVID(A) CONVID(B)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONVID/,
    );
  });
});
