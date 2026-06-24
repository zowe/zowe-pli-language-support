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
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";
import { Severity } from "preprocessor-api";

describe("CICS DUMP TRANSACTION", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("DUMP DUMPCODE(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DUMP DUMPCODE(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDumpTransaction (on parent) -> checkHasMandatoryOptions(DUMPCODE) when FROM present
  test("Missing DUMPCODE with FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DUMP FROM(1) LENGTH(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DUMPCODE/);
  });

  // checkDumpTransactionFrom -> checkHasExactlyOneOption (LENGTH or FLENGTH none)
  test("FROM without LENGTH or FLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DUMP DUMPCODE(1) FROM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: LENGTH or FLENGTH/,
    );
  });

  // checkDumpTransactionSegmentList -> checkHasMandatoryOptions(NUMSEGMENTS)
  test("SEGMENTLIST missing NUMSEGMENTS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DUMP DUMPCODE(1) SEGMENTLIST(2) LENGTHLIST(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: NUMSEGMENTS/,
    );
  });

  // checkDuplicates
  test("Duplicated FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DUMP DUMPCODE(1) FROM(2) FROM(3) LENGTH(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FROM/,
    );
  });
});
