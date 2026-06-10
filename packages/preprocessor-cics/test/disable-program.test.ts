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

describe("CICS DISABLE PROGRAM", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISABLE PROGRAM(1) PURGEABLE",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISABLE PROGRAM(1) PURGEABLE BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDisableProgram -> checkHasMandatoryOptions(PROGRAM)
  test("Missing PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("DISABLE EXIT(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: PROGRAM/);
  });

  // checkDisableProgram -> checkHasAtLeastOneOption (none provided)
  test("No accessory option", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("DISABLE PROGRAM(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Must include one or more of the following: EXIT or EXITALL or FORMATEDF or PURGEABLE or SHUTDOWN or SPI or STOP or TASKSTART/,
    );
  });

  // checkDisableProgram -> checkHasMutuallyExclusiveOptions (EXIT vs PURGEABLE)
  test("EXIT mutually exclusive with PURGEABLE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISABLE PROGRAM(1) EXIT(2) PURGEABLE",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: EXIT or PURGEABLE/,
    );
  });

  // checkDuplicates
  test("Duplicated PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DISABLE PROGRAM(1) PROGRAM(2) PURGEABLE",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: PROGRAM/,
    );
  });
});
