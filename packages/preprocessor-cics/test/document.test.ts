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

describe("CICS DOCUMENT", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Positive (CREATE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DOCUMENT CREATE DOCTOKEN(1)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DOCUMENT CREATE DOCTOKEN(1) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDocumentCreate -> checkHasMandatoryOptions(DOCTOKEN)
  test("CREATE missing DOCTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("DOCUMENT CREATE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DOCTOKEN/);
  });

  // checkDocumentDelete -> checkHasMandatoryOptions(DOCTOKEN)
  test("DELETE missing DOCTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("DOCUMENT DELETE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DOCTOKEN/);
  });

  // checkDuplicates
  test("Duplicated DOCTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "DOCUMENT CREATE DOCTOKEN(1) DOCTOKEN(2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: DOCTOKEN/,
    );
  });
});
