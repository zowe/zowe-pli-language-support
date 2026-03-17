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
import { describe, test, expect, afterEach } from "vitest";

import { TextDocument } from "vscode-languageserver-textdocument";
import { UriUtils } from "../../src/utils/uri";
import { getFileContentPreview } from "../../src/language-server/cache/include-cache";
import { parse } from "../utils";

const mockCode = Array.from(
  { length: 100 },
  (_, i) => `DCL Var${i + 1} FIXED;`,
).join("\n");
const mockPath = UriUtils.toUri("/test.pli").toString();
const mockDocument = TextDocument.create(mockPath, "pli", 1, mockCode);
const mockUnit = await parse(mockDocument.getText(), { validate: false });

afterEach(() => {
  mockUnit.services.includeCache.clear();
});

//
// ----------------------------------------------------------
// Include Cache tests
// ----------------------------------------------------------
describe("getFileContentPreview", () => {
  test("Returns full content when file has less than specificied lines", () => {
    const result = getFileContentPreview(mockUnit, mockPath, mockDocument);
    expect(result).toBeDefined();
    expect(result).toBe(mockCode);
  });
  test("Returns cached value on second call", () => {
    expect(mockUnit.services.includeCache.get(mockPath)).toBeUndefined();
    const result = getFileContentPreview(mockUnit, mockPath, mockDocument, 150);
    expect(mockUnit.services.includeCache.get(mockPath)).toBeDefined();
    expect(result).toBe(mockCode);
  });
  test("Uses correct cache key", () => {
    const resultOne = getFileContentPreview(
      mockUnit,
      mockPath,
      mockDocument,
      150,
    );
    expect(mockUnit.services.includeCache.get(mockPath)).toBeDefined();
    expect(
      mockUnit.services.includeCache.get(`${mockPath}v02`),
    ).toBeUndefined();
    const resultTwo = getFileContentPreview(
      mockUnit,
      `${mockPath}v02`,
      mockDocument,
      150,
    );
    expect(mockUnit.services.includeCache.get(`${mockPath}v02`)).toBeDefined();

    expect(resultOne).toBe(mockCode);
    expect(resultTwo).toBe(mockCode);
  });

  test("Returns partial content when not cached / when file has more than specified lines", () => {
    const result = getFileContentPreview(mockUnit, mockPath, mockDocument, 5);
    expect(result).toBeDefined();
    expect(result).toBe(
      `DCL Var1 FIXED;
DCL Var2 FIXED;
DCL Var3 FIXED;
DCL Var4 FIXED;
DCL Var5 FIXED;

...
`,
    );
  });
});
