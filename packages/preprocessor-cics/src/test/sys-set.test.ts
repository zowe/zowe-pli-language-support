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

describe("CICS SET (system programming)", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (ATOMSERVICE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ENABLED",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ENABLED BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkAtomservice -> checkMutuallyExclusiveOptions
  test("ATOMSERVICE ENABLED and DISABLED mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ENABLED DISABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "ENABLESTATUS, ENABLED or DISABLED" are mutually exclusive/,
    );
  });

  // checkDoctemplate -> checkHasExactlyOneOption(COPY or NEWCOPY)
  test("DOCTEMPLATE without COPY or NEWCOPY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET DOCTEMPLATE(DT)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: COPY or NEWCOPY/,
    );
  });

  // checkFile -> checkMutuallyExclusiveOptions(OPEN or CLOSED)
  test("FILE OPEN and CLOSED mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET FILE(FL) OPEN CLOSED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "OPEN or CLOSED" are mutually exclusive/,
    );
  });

  // checkTagsRefresh -> checkHasMandatoryOptions(REFRESH)
  test("TAGS missing REFRESH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TAGS");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: REFRESH/);
  });

  // checkAssociationUsercorrdata -> checkHasMandatoryOptions(USERCORRDATA)
  test("ASSOCIATION missing USERCORRDATA", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET ASSOCIATION");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: USERCORRDATA/,
    );
  });

  // checkDuplicates
  test("Duplicated ATOMSERVICE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ATOMSERVICE(AT2) ENABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ATOMSERVICE/,
    );
  });
});
