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

describe("CICS SIGNAL EVENT", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SIGNAL EVENT(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNAL EVENT(123) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkSignalEvent -> checkHasMandatoryOptions(EVENT)
  test("Missing EVENT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNAL FROMCHANNEL(123)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: EVENT/);
  });

  // checkSignalEvent -> checkHasMutuallyExclusiveOptions
  test("Mutually exclusive FROMCHANNEL and FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNAL EVENT(123) FROMCHANNEL(456) FROM(789)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: FROMCHANNEL or FROM/,
    );
  });

  // checkSignalEvent -> checkOptionalWithLength (optional present without required field)
  test("FROMLENGTH without FROM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNAL EVENT(123) FROMLENGTH(5)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: FROMLENGTH without FROM/,
    );
  });

  // checkDuplicates
  test("Duplicated EVENT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SIGNAL EVENT(123) EVENT(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: EVENT/,
    );
  });
});
