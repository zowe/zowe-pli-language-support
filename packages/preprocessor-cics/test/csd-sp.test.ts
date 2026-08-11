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

describe("CICS CSD (SP)", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD LIST(L) GROUP(G) BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkDuplicates
  test("Duplicated ADD", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD ADD LIST(L) GROUP(G)",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Warning);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ADD/,
    );
  });

  test("ADD", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ADD LIST(LL) GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ADD missing GROUP", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD ADD LIST(LL)");
    expect(diagnostics).toHaveLength(1);
  });
  test("ALTER", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ALTER RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("ALTER missing RESID", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD ALTER GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("APPEND", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD APPEND LIST(LL) TO(TT)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD COPY GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("COPY without AS or TO", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD COPY GROUP(GG)");
    expect(diagnostics).toHaveLength(1);
  });
  test("DEFINE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD DEFINE RESID(RR) GROUP(GG) ATTRIBUTES(AA) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("DELETE", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD DELETE GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTGROUP", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTLIST", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD GETNEXTLIST LIST(LL)");
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("GETNEXTRSRCE ATTRLEN without ATTRIBUTES/SET", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD GETNEXTRSRCE RESTYPE(RT) RESID(RR) GROUP(GG) ATTRLEN(AL)",
    );
    expect(diagnostics).toHaveLength(2);
  });
  test("INQUIREGROUP", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INQUIREGROUP GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRELIST", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD INQUIRELIST LIST(LL)");
    expect(diagnostics).toHaveLength(0);
  });
  test("INQUIRERSRCE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INQUIRERSRCE RESID(RR) GROUP(GG) PROGRAM ATTRIBUTES(AA)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD INSTALL GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("INSTALL LIST with cvda illegal", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD INSTALL LIST(LL) PROGRAM",
    );
    expect(diagnostics).toHaveLength(1);
  });
  test("LOCK", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD LOCK GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("REMOVE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD REMOVE GROUP(GG) LIST(LL)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("RENAME", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD RENAME GROUP(GG) AS(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("STARTBRRSRCE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD STARTBRRSRCE GROUP(GG)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  test("UNLOCK", () => {
    const { diagnostics } = cicsPreprocessor.parse("CSD UNLOCK GROUP(GG)");
    expect(diagnostics).toHaveLength(0);
  });
  test("USERDEFINE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "CSD USERDEFINE GROUP(GG) ATTRIBUTES(AA) RESID(RR) PROGRAM",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
