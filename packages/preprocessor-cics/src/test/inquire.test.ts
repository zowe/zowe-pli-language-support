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

describe("CICS INQUIRE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (CONTAINER)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE CONTAINER(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE CONTAINER(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // container branch -> checkHasIllegalOptions(PROCESSTYPE) without PROCESS
  test("CONTAINER PROCESSTYPE without PROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE CONTAINER(1) PROCESSTYPE(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Invalid option provided: PROCESSTYPE without PROCESS/,
    );
  });

  // process branch -> checkHasMandatoryOptions(PROCESSTYPE)
  test("PROCESS missing PROCESSTYPE", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("INQUIRE PROCESS(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: PROCESSTYPE/,
    );
  });

  // checkDuplicates (CONTAINER is the single lead token; SET is repeatable)
  test("Duplicated SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "INQUIRE CONTAINER(1) SET(2) SET(3)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: SET/,
    );
  });
});
