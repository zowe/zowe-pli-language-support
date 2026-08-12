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

describe("CICS Identifiers", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("ID is `cicsLexerDefinedVariableUsageTokens`", () => {
    const { tokens } = cicsPreprocessor.parse("DEQ RESOURCE(resourceName)");
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });

  test("ID is `cicsWord`", () => {
    const { tokens } = cicsPreprocessor.parse("DEQ RESOURCE(resourceName1)");
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });

  test("ID is `cicsWords`", () => {
    const { tokens } = cicsPreprocessor.parse("DEQ RESOURCE(ACQFAIL)");
    expect(tokens[2].semanticsKind).toBe(SemanticsKind.Identifier);
  });
});
