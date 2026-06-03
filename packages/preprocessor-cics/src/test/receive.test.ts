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

describe("CICS RECEIVE", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (group one)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RECEIVE INTO(1)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RECEIVE INTO(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkGroupOne -> checkHasExactlyOneOption(LENGTH or FLENGTH) when SET present
  test("SET requires LENGTH or FLENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("RECEIVE SET(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: LENGTH or FLENGTH/,
    );
  });

  // checkMap -> checkHasExactlyOneOption(INTO or SET) when MAP has no literal
  test("MAP without INTO or SET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RECEIVE MAP(MP) FROM(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO or SET when specifying MAP param without literal/,
    );
  });

  // checkDuplicates
  test("Duplicated INTO", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "RECEIVE INTO(1) INTO(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: INTO/,
    );
  });
});
