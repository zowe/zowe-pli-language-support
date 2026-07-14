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
import { splitGlobPattern } from "../../src/config/lib-expander";

describe("splitGlobPattern", () => {
  test.each([
    // pattern | base | tail
    // Relative patterns keep an empty base (the workspace).
    ["copybooks/**", "copybooks", "**"],
    ["copy/*/books", "copy", "*/books"],
    ["copy/**/books", "copy", "**/books"],
    ["SQL_cobol/endevor/**/COPY", "SQL_cobol/endevor", "**/COPY"],
    // Globstar/partial glob in the first segment => workspace-rooted.
    ["**/inc", "", "**/inc"],
    ["*/inc", "", "*/inc"],
    ["copy*/books", "", "copy*/books"],
    ["foo/bar*baz/**", "foo", "bar*baz/**"],
    // Absolute (Unix) patterns keep an absolute base.
    ["/tmp/cpyabs/**", "/tmp/cpyabs", "**"],
    ["/progs/*.pli", "/progs", "*.pli"],
    // Absolute (Windows) patterns, including backslash separators.
    ["C:/copybooks/**", "C:/copybooks", "**"],
    ["C:/copy/*/books", "C:/copy", "*/books"],
    ["C:\\copy\\*\\books", "C:/copy", "*/books"],
    // Trailing separators are trimmed before splitting.
    ["C:/copy/*/books/", "C:/copy", "*/books"],
    // Pathological root globs still preserve the root.
    ["/**", "/", "**"],
  ])("splits %j into base+tail", (pattern, base, tail) => {
    expect(splitGlobPattern(pattern)).toEqual({ base, tail });
  });

  test("defensively returns a glob-free pattern as the base", () => {
    expect(splitGlobPattern("copybooks")).toEqual({
      base: "copybooks",
      tail: "",
    });
  });
});
