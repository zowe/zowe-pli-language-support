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

describe("CICS WRITE", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive (FILE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE FILE(1) FROM(2) RIDFLD(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE FILE(1) FROM(2) RIDFLD(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkWriteFile -> checkHasMandatoryOptions(FROM)
  test("FILE missing FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE FILE(1) RIDFLD(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FROM/);
  });

  // checkWriteFile -> checkHasExactlyOneOption (none provided)
  test("Neither FILE nor DATASET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE FROM(1) RIDFLD(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FILE or DATASET/,
    );
  });

  // checkWriteJournalname -> checkHasMandatoryOptions(JTYPEID)
  test("JOURNALNAME missing JTYPEID", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE JOURNALNAME(1) FROM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: JTYPEID/);
  });

  // checkWriteOperator -> checkHasMutuallyExclusiveOptions
  test("OPERATOR mutually exclusive EVENTUAL and ACTION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE OPERATOR TEXT(1) EVENTUAL ACTION(2)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: EVENTUAL or ACTION or CRITICAL or IMMEDIATE or REPLY/,
    );
  });

  // checkDuplicates
  test("Duplicated FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WRITE FILE(1) FROM(2) FROM(3) RIDFLD(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: FROM/,
    );
  });
});
