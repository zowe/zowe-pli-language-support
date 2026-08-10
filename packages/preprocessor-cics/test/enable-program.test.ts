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

describe("CICS ENABLE PROGRAM", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ENABLE PROGRAM(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENABLE PROGRAM(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkEnableProgram -> checkHasMandatoryOptions(PROGRAM)
  test("Missing PROGRAM", async () => {
    const { diagnostics } = cicsPreprocessor.parse("ENABLE ENTRYNAME(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkEnableProgram -> checkHasIllegalOptions(GAEXECUTABLE) when GALENGTH absent
  test("GAEXECUTABLE without GALENGTH", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENABLE PROGRAM(1) GAEXECUTABLE",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: GAEXECUTABLE without GALENGTH/,
    );
  });

  // checkEnableProgram -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive QUASIRENT and THREADSAFE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENABLE PROGRAM(1) QUASIRENT THREADSAFE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: QUASIRENT or THREADSAFE or REQUIRED/,
    );
  });

  // checkDuplicates
  test("Duplicated PROGRAM", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "ENABLE PROGRAM(1) PROGRAM(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
