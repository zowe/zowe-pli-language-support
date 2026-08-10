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

describe("CICS DELETEQ / DEQ", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (DELETEQ TD)", async () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETEQ TD QUEUE(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELETEQ TD QUEUE(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDeleteqTd -> checkHasMandatoryOptions(QUEUE)
  test("DELETEQ TD missing QUEUE", async () => {
    const { diagnostics } = cicsPreprocessor.parse("DELETEQ TD");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: QUEUE/);
  });

  // checkDeqCmds -> checkHasMandatoryOptions(RESOURCE)
  test("DEQ missing RESOURCE", async () => {
    const { diagnostics } = cicsPreprocessor.parse("DEQ LENGTH(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: RESOURCE/);
  });

  // checkDeqCmds -> checkHasMutuallyExclusiveOptions
  test("DEQ mutually exclusive UOW and TASK", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DEQ RESOURCE(1) UOW TASK",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: UOW or MAXLIFETIME or TASK/,
    );
  });

  // checkDuplicates
  test("Duplicated QUEUE", async () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "DELETEQ TD QUEUE(1) QUEUE(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: QUEUE/,
    );
  });
});
