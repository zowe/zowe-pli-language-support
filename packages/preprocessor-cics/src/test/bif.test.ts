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

describe("CICS BIF", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (DEEDIT)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "BIF DEEDIT FIELD(123)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "BIF DEEDIT FIELD(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      "Extraneous input BLA",
    );
  });

  // checkDeedit -> checkHasMandatoryOptions(FIELD)
  test("DEEDIT missing FIELD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("BIF DEEDIT");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FIELD/);
  });

  // checkDigest -> checkHasMandatoryOptions(RESULT)
  test("DIGEST missing RESULT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "BIF DIGEST RECORD(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RESULT/);
  });

  // checkDigest -> checkHasMutuallyExclusiveOptions
  test("DIGEST mutually exclusive HEX and BINARY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "BIF DIGEST RECORD(123) RESULT(456) HEX BINARY",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: HEX or BINARY or BASE64 or DIGESTTYPE/,
    );
  });

  // checkDuplicates
  test("Duplicated RECORD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "BIF DIGEST RECORD(123) RECORD(456) RESULT(789)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: RECORD/,
    );
  });
});
