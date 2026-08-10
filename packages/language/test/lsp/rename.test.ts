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
import { parseAndLink } from "../utils";
import { renameRequest } from "../../src/language-server/rename-request";
import { UriUtils } from "../../src/utils/uri";

describe("Rename", () => {
  test("refuses renaming a symbol declared only in generated code", async () => {
    const text = `
    MAIN: PROC;
      %DCL SOME_VAR CHAR INIT("DCL TEST_VAR FIXED;");
      SOME_VAR
      TEST_VAR = 24;
    END;`;
    const unit = await parseAndLink(text);
    const result = renameRequest(
      unit,
      UriUtils.toUri("test.pli"),
      text.lastIndexOf("TEST_VAR"),
    );
    expect(result.kind).toBe("generated");
    expect(result.kind === "generated" && result.name).toBe("TEST_VAR");
  });

  test("reports 'none' when there is no symbol at the position", async () => {
    const text = `
    MAIN: PROC;
    END;`;
    const unit = await parseAndLink(text);
    // Offset 0 is whitespace - nothing to rename, and the handler must answer
    // "no result" instead of an empty (seemingly successful) edit set.
    const result = renameRequest(unit, UriUtils.toUri("test.pli"), 0);
    expect(result.kind).toBe("none");
  });

  test("refuses renaming a built-in symbol", async () => {
    const text = `
    MAIN: PROC;
      PUT(SQRT(9));
    END;`;
    const unit = await parseAndLink(text);
    const result = renameRequest(
      unit,
      UriUtils.toUri("test.pli"),
      text.indexOf("SQRT"),
    );
    expect(result.kind).toBe("builtin");
    expect(result.kind === "builtin" && result.name).toBe("SQRT");
  });

  test("renaming a variable with generated usages only edits real source", async () => {
    const text = `
    %MYMACRO: PROC;
      ANSWER ('X = 1;');
    %END;
    %ACTIVATE MYMACRO;
    TEST: PROC;
      DCL X FIXED;
      MYMACRO
      X = 2;
    END;`;
    const unit = await parseAndLink(text);
    const result = renameRequest(
      unit,
      UriUtils.toUri("test.pli"),
      text.indexOf("DCL X") + 4,
    );
    expect(result.kind).toBe("edits");
    if (result.kind !== "edits") {
      return;
    }
    const locations = Object.values(result.changes).flat();
    // The declaration and the real usage; the macro-generated `X = 1;` usage has no
    // position in any source file and must not produce an edit.
    expect(locations).toHaveLength(2);
    for (const location of locations) {
      expect(text.slice(location.range.start, location.range.end)).toBe("X");
    }
  });
});
