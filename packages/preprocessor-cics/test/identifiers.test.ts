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
import { SemanticsKind } from "preprocessor-api";

describe("CICS Identifiers", async () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("ID is `cicsLexerDefinedVariableUsageTokens`", async () => {
    const { tokens } = await cicsPreprocessor.execute(
      "DEQ RESOURCE(resourceName)",
    );
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });

  test("ID is `cicsWord`", async () => {
    const { tokens } = await cicsPreprocessor.execute(
      "DEQ RESOURCE(resourceName1)",
    );
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });

  test("ID is `cicsWords`", async () => {
    const { tokens } = await cicsPreprocessor.execute("DEQ RESOURCE(ACQFAIL)");
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });
});
