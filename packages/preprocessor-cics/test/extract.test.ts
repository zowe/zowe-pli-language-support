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

describe("CICS EXTRACT", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (ATTACH)", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "EXTRACT ATTACH ATTACHID(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "EXTRACT ATTACH ATTACHID(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAttach -> checkHasMutuallyExclusiveOptions
  test("ATTACH mutually exclusive ATTACHID and CONVID", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "EXTRACT ATTACH ATTACHID(1) CONVID(2)",
    );
    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, options are mutually exclusive: ATTACHID or CONVID or SESSION/,
    );
  });

  // checkLogonMsg -> checkHasMandatoryOptions(LENGTH)
  test("LOGONMSG missing LENGTH", () => {
    const { diagnostics } = cicsPreprocessor.parse("EXTRACT LOGONMSG INTO(1)");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: LENGTH/);
  });

  // checkDuplicates
  test("Duplicated ATTACH", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "EXTRACT ATTACH ATTACH ATTACHID(1)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ATTACH/,
    );
  });
});
