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

describe("CICS READNEXT/READPREV", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) RIDFLD(2) INTO(3)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) RIDFLD(2) INTO(3) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkReadNextReadPrevBody -> checkHasMandatoryOptions(cics_file_name)
  test("Missing FILE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT RIDFLD(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: FILE/);
  });

  // checkReadNextReadPrevBody -> checkHasMandatoryOptions(RIDFLD)
  test("Missing RIDFLD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RIDFLD/);
  });

  // checkReadNextReadPrevBody -> checkHasExactlyOneOption (INTO or SET none)
  test("Neither INTO nor SET", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) RIDFLD(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO or SET/,
    );
  });

  // checkReadNextReadPrevBody -> checkHasIllegalOptions (TOKEN without UPDATE)
  test("TOKEN without UPDATE", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) RIDFLD(2) INTO(3) TOKEN(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: TOKEN without UPDATE/,
    );
  });

  // checkDuplicates (RIDFLD is a direct child; FILE is nested in cics_file_name
  // which checkDuplicates does not descend into, so it cannot be flagged)
  test("Duplicated RIDFLD", async () => {
    const { diagnostics } = await cicsPreprocessor.parse(
      "READNEXT FILE(1) RIDFLD(2) RIDFLD(3) INTO(4)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: RIDFLD/,
    );
  });
});
