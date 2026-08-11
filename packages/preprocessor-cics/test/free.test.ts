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

describe("CICS FREE", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive", () => {
    const { diagnostics } = cicsPreprocessor.parse("FREE CONVID(123)");
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse("FREE CONVID(123) BLA");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkRule -> checkMutuallyExclusiveOptions
  test("Mutually exclusive CONVID and SESSION", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FREE CONVID(123) SESSION(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "CONVID or SESSION" are mutually exclusive/,
    );
  });

  // checkRule -> checkHasIllegalOptions when CHILD is present
  test("CONVID illegal with CHILD", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FREE CHILD(123) CONVID(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Invalid option provided: CONVID/);
  });

  // checkDuplicates
  test("Duplicated CONVID", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "FREE CONVID(123) CONVID(456)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: CONVID/,
    );
  });
});
