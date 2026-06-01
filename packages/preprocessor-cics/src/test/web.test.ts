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

describe("CICS WEB", async () => {
  const cicsPreprocessor = new CICSPreprocessor();

  test("Positive (CLOSE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CLOSE SESSTOKEN(TOK)",
    );
    expect(diagnostics).toHaveLength(0);
  });

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CLOSE SESSTOKEN(TOK) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch(
      /extraneous input 'BLA' expecting <EOF>/,
    );
  });

  // checkClose -> checkHasMandatoryOptions(SESSTOKEN)
  test("CLOSE missing SESSTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB CLOSE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: SESSTOKEN/);
  });

  // checkOpen -> checkHasExactlyOneOption(URIMAP or HOST)
  test("OPEN without URIMAP or HOST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB OPEN SESSTOKEN(TOK)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: URIMAP or HOST/,
    );
  });

  // checkParse -> checkHasMandatoryOptions(URL)
  test("PARSE missing URL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB PARSE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: URL/);
  });

  // checkRetrieve -> checkHasMandatoryOptions(DOCTOKEN)
  test("RETRIEVE missing DOCTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB RETRIEVE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DOCTOKEN/);
  });

  // checkWrite -> checkHasMandatoryOptions(HTTPHEADER)
  test("WRITE missing HTTPHEADER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB WRITE VALUE(VAL)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Missing required option: HTTPHEADER/,
    );
  });

  // checkEndbrowse -> checkHasExactlyOneOption(FORMFIELD, HTTPHEADER, QUERYPARM)
  test("ENDBROWSE without FORMFIELD/HTTPHEADER/QUERYPARM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB ENDBROWSE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: FORMFIELD, HTTPHEADER, QUERYPARM/,
    );
  });

  // checkReceive -> checkHasExactlyOneOption(INTO, SET, LENGTH or TOCONTAINER)
  test("RECEIVE without INTO/SET/LENGTH/TOCONTAINER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB RECEIVE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Exactly one option required, none provided: INTO, SET, LENGTH or TOCONTAINER/,
    );
  });

  // checkDuplicates
  test("Duplicated SESSTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CLOSE SESSTOKEN(TOK) SESSTOKEN(TK2)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: SESSTOKEN/,
    );
  });
});
