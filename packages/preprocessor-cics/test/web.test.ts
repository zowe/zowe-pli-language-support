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

describe("CICS WEB", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CLOSE SESSTOKEN(TOK) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkRetrieve -> checkHasMandatoryOptions(DOCTOKEN)
  test("RETRIEVE missing DOCTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB RETRIEVE");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(/Missing required option: DOCTOKEN/);
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

  test("CLOSE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CLOSE SESSTOKEN(TK)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("CLOSE missing SESSTOKEN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB CLOSE");
    expect(diagnostics).toHaveLength(1);
  });
  test("CONVERSE client", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CONVERSE SESSTOKEN(TK) GET INTO(IN) TOLENGTH(TL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("CONVERSE body+auth branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB CONVERSE SESSTOKEN(TK) DOCTOKEN(DT) NODOCDELETE USERNAME(UN)",
    );
    expect(diagnostics).toHaveLength(3);
  });
  test("ENDBROWSE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB ENDBROWSE HTTPHEADER SESSTOKEN(TK)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("EXTRACT server", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB EXTRACT REQUESTTYPE(RT) HTTPMETHOD(HM)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("EXTRACT client", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB EXTRACT SESSTOKEN(TK) REALM(RM)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("OPEN URIMAP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB OPEN URIMAP(UM) SESSTOKEN(TK)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("OPEN HOST (missing SCHEME/HTTP/HTTPS)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB OPEN HOST(HS) SESSTOKEN(TK)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("PARSE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("WEB PARSE URL(UL)");
    expect(diagnostics).toHaveLength(0);
  });
  test("READ FORMFIELD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB READ FORMFIELD(FF) VALUE(VL) VALUELENGTH(VN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("READ HTTPHEADER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB READ HTTPHEADER(HH) VALUE(VL) VALUELENGTH(VN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("READ QUERYPARM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB READ QUERYPARM(QP) VALUE(VL) VALUELENGTH(VN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("READNEXT", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB READNEXT FORMFIELD(FF) NAMELENGTH(NL) VALUE(VL) VALUELENGTH(VN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RECEIVE buffer", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB RECEIVE INTO(IN) LENGTH(LN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RECEIVE container", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB RECEIVE TOCONTAINER(TC)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RECEIVE status branch", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB RECEIVE SESSTOKEN(TK) STATUSCODE(SC) STATUSTEXT(ST)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("RETRIEVE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB RETRIEVE DOCTOKEN(DT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SEND client", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB SEND SESSTOKEN(TK) GET MEDIATYPE(MT) DOCTOKEN(DT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SEND server", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB SEND DOCTOKEN(DT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("SEND server status", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB SEND STATUSCODE(SC) STATUSTEXT(ST) LENGTH(LN)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("STARTBROWSE FORMFIELD", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB STARTBROWSE FORMFIELD(FF)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("STARTBROWSE HTTPHEADER illegal NAMELENGTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB STARTBROWSE HTTPHEADER NAMELENGTH(NL)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("STARTBROWSE QUERYPARM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB STARTBROWSE QUERYPARM(QP)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("WRITE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "WEB WRITE HTTPHEADER(HH) VALUE(VL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
