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
import { describe, test, expect } from "vitest";
import { URI, UriUtils } from "../../src/utils/uri";

describe("UriUtils.toUri", () => {
  test("returns URI objects unchanged", () => {
    const uri = UriUtils.toUri("/workspace/main.pli");
    expect(UriUtils.toUri(uri)).toBe(uri);
  });

  test("treats bare Unix paths as file URIs", () => {
    const uri = UriUtils.toUri("/workspace/main.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toBe("/workspace/main.pli");
  });

  test("treats bare relative paths as file URIs", () => {
    const uri = UriUtils.toUri("workspace/main.pli");
    expect(uri.scheme).toBe("file");
  });

  test("parses file:// URI strings via UriUtils.toUri", () => {
    const uri = UriUtils.toUri("file:///workspace/main.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toBe("/workspace/main.pli");
  });

  test("parses memory:// URI strings via UriUtils.toUri", () => {
    const uri = UriUtils.toUri("memory:///test/test.pli");
    expect(uri.scheme).toBe("memory");
    expect(uri.path).toBe("/test/test.pli");
  });

  test("treats Windows drive paths as file URIs", () => {
    const uri = UriUtils.toUri("C:\\Users\\path\\file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toMatch(/users\/path\/file\.pli$/i);
  });

  test("treats C:/ paths as file URIs, not scheme:path", () => {
    const uri = UriUtils.toUri("C:/Users/path/file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toMatch(/users\/path\/file\.pli$/i);
  });

  test("correctly encodes # in filenames when using bare paths", () => {
    const uri = UriUtils.toUri("/path/A1@#_$/file.pli");
    expect(uri.fragment).toBe("");
    expect(uri.path).toContain("#");
  });

  test("escapes # to %23 in file:// URI strings before parsing", () => {
    const uri = UriUtils.toUri("file:///path/A1@#_$");
    expect(uri.path).toBe("/path/A1@#_$");
    expect(uri.fragment).toBe("");
    expect(uri.toString()).toContain("%23");
  });

  test("escapes # to %23 in memory:// URI strings before parsing", () => {
    const uri = UriUtils.toUri("memory:///path/A1@#_$");
    expect(uri.path).toBe("/path/A1@#_$");
    expect(uri.fragment).toBe("");
  });

  test("preserves # as fragment delimiter for non-file schemes", () => {
    const uri = UriUtils.toUri("https://example.com/page#section");
    expect(uri.path).toBe("/page");
    expect(uri.fragment).toBe("section");
  });

  test("defensively merges fragment for URI objects with stale fragment", () => {
    const raw = URI.parse("file:///path/A1@#_$");
    expect(raw.fragment).toBe("_$");
    const fixed = UriUtils.toUri(raw);
    expect(fixed.path).toBe("/path/A1@#_$");
    expect(fixed.fragment).toBe("");
  });

  test("encodes spaces in bare paths", () => {
    const uri = UriUtils.toUri("/path/my file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toBe("/path/my file.pli");
    expect(uri.toString()).toContain("%20");
  });

  test("preserves %20 encoding in URI strings", () => {
    const uri = UriUtils.toUri("file:///path/my%20file.pli");
    expect(uri.path).toBe("/path/my file.pli");
  });

  test("double-encodes % in bare paths (URI.file behavior)", () => {
    const uri = UriUtils.toUri("/path/file%20name.pli");
    expect(uri.toString()).toContain("%2520");
  });

  test("encodes # in Windows drive paths", () => {
    const uri = UriUtils.toUri("C:/path/A#B/file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.fragment).toBe("");
    expect(uri.path).toContain("#");
  });

  test("handles lowercase drive letters", () => {
    const uri = UriUtils.toUri("c:/Users/path/file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toMatch(/users\/path\/file\.pli$/i);
  });

  test("routes file:///c:/path through URI.parse, not URI.file", () => {
    const uri = UriUtils.toUri("file:///c:/Users/file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toBe("/c:/Users/file.pli");
  });

  test("handles file:// with authority (UNC-style)", () => {
    const uri = UriUtils.toUri("file://server/share/path");
    expect(uri.scheme).toBe("file");
    expect(uri.authority).toBe("server");
    expect(uri.path).toBe("/share/path");
  });

  test("handles spaces in Windows drive paths", () => {
    const uri = UriUtils.toUri("C:/Users/My Documents/file.pli");
    expect(uri.scheme).toBe("file");
    expect(uri.path).toContain("My Documents");
    expect(uri.fragment).toBe("");
  });
});

describe("UriUtils.toNormalizedKey", () => {
  test("produces identical keys for UriUtils.toUri and UriUtils.toUri of the same file", () => {
    const fromFile = UriUtils.toUri("/workspace/main.pli");
    const fromParse = UriUtils.toUri("file:///workspace/main.pli");
    expect(UriUtils.toNormalizedKey(fromFile)).toBe(
      UriUtils.toNormalizedKey(fromParse),
    );
  });

  test("is case-insensitive", () => {
    const lower = UriUtils.toUri("/workspace/Main.PLI");
    const upper = UriUtils.toUri("/workspace/main.pli");
    expect(UriUtils.toNormalizedKey(lower)).toBe(
      UriUtils.toNormalizedKey(upper),
    );
  });

  test("normalizes backslashes", () => {
    const key = UriUtils.toNormalizedKey(URI.file("/workspace/main.pli"));
    expect(key).not.toContain("\\");
  });

  test("includes scheme in key", () => {
    const key = UriUtils.toNormalizedKey(URI.file("/workspace/main.pli"));
    expect(key).toMatch(/^file:\/\//);
  });

  test("produces consistent keys regardless of # encoding in input", () => {
    const fromUnencoded = UriUtils.toUri("file:///path/A1@#_$");
    const fromBarePath = UriUtils.toUri("/path/A1@#_$");
    expect(UriUtils.toNormalizedKey(fromUnencoded)).toBe(
      UriUtils.toNormalizedKey(fromBarePath),
    );
  });

  test("produces consistent keys for Windows drive letter variants", () => {
    const lower = UriUtils.toUri("file:///c:/Users/path");
    const upper = UriUtils.toUri("file:///C:/Users/path");
    expect(UriUtils.toNormalizedKey(lower)).toBe(
      UriUtils.toNormalizedKey(upper),
    );
  });

  test("accepts string input", () => {
    const key = UriUtils.toNormalizedKey("file:///workspace/main.pli");
    expect(key).toBe("file:///workspace/main.pli");
  });

  test("handles memory scheme", () => {
    const key = UriUtils.toNormalizedKey(URI.parse("memory:///test/test.pli"));
    expect(key).toBe("memory:///test/test.pli");
  });
});

describe("UriUtils.toFilePath", () => {
  test("returns path without scheme for Unix paths", () => {
    const result = UriUtils.toFilePath(URI.file("/workspace/main.pli"));
    expect(result).toBe("/workspace/main.pli");
  });

  test("strips leading slash and uppercases Windows drive letter", () => {
    const uri = UriUtils.toUri("file:///c:/Users/path/file.pli");
    expect(UriUtils.toFilePath(uri)).toBe("C:/Users/path/file.pli");
  });

  test("uppercases already-present drive letter without leading slash", () => {
    const uri = UriUtils.toUri("file:///C:/Users/path/file.pli");
    expect(UriUtils.toFilePath(uri)).toBe("C:/Users/path/file.pli");
  });

  test("preserves # in path for filenames containing #", () => {
    const uri = UriUtils.toUri("file:///path/A1@#_$");
    expect(UriUtils.toFilePath(uri)).toBe("/path/A1@#_$");
  });

  test("normalizes backslashes to forward slashes", () => {
    const result = UriUtils.toFilePath(URI.file("/workspace/main.pli"));
    expect(result).not.toContain("\\");
  });

  test("accepts string input", () => {
    const result = UriUtils.toFilePath("file:///workspace/main.pli");
    expect(result).toBe("/workspace/main.pli");
  });

  test("handles file path from UriUtils.toUri with Windows path", () => {
    const uri = UriUtils.toUri("C:\\Users\\test\\file.pli");
    const result = UriUtils.toFilePath(uri);
    expect(result).toBe("C:/Users/test/file.pli");
  });
});

describe("UriUtils.equals", () => {
  test("returns true for identical URIs", () => {
    const a = UriUtils.toUri("/workspace/main.pli");
    const b = UriUtils.toUri("/workspace/main.pli");
    expect(UriUtils.equals(a, b)).toBe(true);
  });

  test("returns true for case-different URIs", () => {
    const a = UriUtils.toUri("/workspace/Main.PLI");
    const b = UriUtils.toUri("/workspace/main.pli");
    expect(UriUtils.equals(a, b)).toBe(true);
  });

  test("returns false for different URIs", () => {
    const a = UriUtils.toUri("/workspace/a.pli");
    const b = UriUtils.toUri("/workspace/b.pli");
    expect(UriUtils.equals(a, b)).toBe(false);
  });

  test("returns true when both are undefined", () => {
    expect(UriUtils.equals(undefined, undefined)).toBe(true);
  });

  test("returns false when only one is undefined", () => {
    expect(UriUtils.equals(URI.file("/a"), undefined)).toBe(false);
    expect(UriUtils.equals(undefined, UriUtils.toUri("/a"))).toBe(false);
  });

  test("works with string inputs", () => {
    expect(
      UriUtils.equals(
        "file:///workspace/main.pli",
        "file:///workspace/main.pli",
      ),
    ).toBe(true);
  });

  test("matches URIs constructed differently for the same file", () => {
    expect(
      UriUtils.equals(
        UriUtils.toUri("/workspace/main.pli"),
        UriUtils.toUri("file:///workspace/main.pli"),
      ),
    ).toBe(true);
  });

  test("matches URIs with different Windows drive letter casing", () => {
    expect(
      UriUtils.equals(
        UriUtils.toUri("file:///c:/Users/file.pli"),
        UriUtils.toUri("file:///C:/Users/file.pli"),
      ),
    ).toBe(true);
  });
});

describe("UriUtils.parts", () => {
  test("splits a simple path into segments", () => {
    expect(UriUtils.parts("a/b/c")).toEqual(["a", "b", "c"]);
  });

  test("filters out empty segments from leading slash", () => {
    expect(UriUtils.parts("/workspace/src")).toEqual(["workspace", "src"]);
  });

  test("filters out empty segments from trailing slash", () => {
    expect(UriUtils.parts("workspace/src/")).toEqual(["workspace", "src"]);
  });

  test("returns empty array for root path", () => {
    expect(UriUtils.parts("/")).toEqual([]);
  });

  test("returns empty array for empty string", () => {
    expect(UriUtils.parts("")).toEqual([]);
  });
});

describe("UriUtils.isPathRelative", () => {
  test("returns true for ./ prefix", () => {
    expect(UriUtils.isPathRelative("./file.pli")).toBe(true);
  });

  test("returns true for ../ prefix", () => {
    expect(UriUtils.isPathRelative("../file.pli")).toBe(true);
  });

  test("returns true for bare name (no slash, starts with letter)", () => {
    expect(UriUtils.isPathRelative("file.pli")).toBe(true);
  });

  test("returns true for bare relative path with subdirectory", () => {
    expect(UriUtils.isPathRelative("src/file.pli")).toBe(true);
  });

  test("returns false for Unix absolute path", () => {
    expect(UriUtils.isPathRelative("/workspace/file.pli")).toBe(false);
  });

  test("returns false for Windows absolute path", () => {
    expect(UriUtils.isPathRelative("C:/Users/file.pli")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(UriUtils.isPathRelative("")).toBe(false);
  });
});

describe("UriUtils.relative", () => {
  test("returns filename when file is directly under from directory", () => {
    expect(UriUtils.relative("/workspace", "/workspace/file.pli")).toBe(
      "file.pli",
    );
  });

  test("returns nested relative path for file deeper in workspace", () => {
    expect(UriUtils.relative("/workspace", "/workspace/src/main.pli")).toBe(
      "src/main.pli",
    );
  });

  test("returns deeply nested relative path", () => {
    expect(UriUtils.relative("/workspace", "/workspace/a/b/c/file.pli")).toBe(
      "a/b/c/file.pli",
    );
  });

  test("returns relative segment from sibling directory (1 non-common)", () => {
    expect(UriUtils.relative("/workspace/a", "/workspace/b/file.pli")).toBe(
      "b/file.pli",
    );
  });

  test("falls back to absolute when paths diverge by more than 1 segment", () => {
    expect(UriUtils.relative("/a/b/c", "/d/e/f.pli")).toBe("/d/e/f.pli");
  });

  test("handles from being the filesystem root", () => {
    expect(UriUtils.relative("/", "/workspace/file.pli")).toBe(
      "workspace/file.pli",
    );
  });

  test("returns empty string for identical paths", () => {
    expect(
      UriUtils.relative("/workspace/file.pli", "/workspace/file.pli"),
    ).toBe("");
  });

  test("works with URI objects", () => {
    const from = UriUtils.toUri("/workspace");
    const to = UriUtils.toUri("/workspace/src/file.pli");
    expect(UriUtils.relative(from, to)).toBe("src/file.pli");
  });

  test("works with file:// URI strings", () => {
    expect(
      UriUtils.relative("file:///workspace", "file:///workspace/src/file.pli"),
    ).toBe("src/file.pli");
  });

  test("returns absolute path when single-segment paths share no prefix", () => {
    expect(UriUtils.relative("/alpha", "/beta/file.pli")).toBe(
      "/beta/file.pli",
    );
  });

  test("works with realistic multi-segment workspace paths", () => {
    expect(
      UriUtils.relative(
        "/Users/dev/projects/myapp",
        "/Users/dev/projects/myapp/src/main.pli",
      ),
    ).toBe("src/main.pli");
  });

  test("falls back to full path when from diverges by more than 1 segment", () => {
    expect(
      UriUtils.relative("/Users/dev/workspace", "/Users/other/file.pli"),
    ).toBe("/Users/other/file.pli");
  });

  describe("Windows drive-letter paths", () => {
    test("returns drive-stripped path when drives differ", () => {
      expect(UriUtils.relative("C:/workspace", "D:/other/file.pli")).toBe(
        "/other/file.pli",
      );
    });

    test("returns relative path when same drive and shared workspace", () => {
      expect(
        UriUtils.relative("C:/workspace", "C:/workspace/src/file.pli"),
      ).toBe("src/file.pli");
    });

    test("returns drive-stripped path when same drive but no shared folder", () => {
      expect(UriUtils.relative("C:/alpha", "C:/beta/file.pli")).toBe(
        "/beta/file.pli",
      );
    });

    test("handles Windows root as from", () => {
      expect(UriUtils.relative("C:/", "C:/workspace/file.pli")).toBe(
        "workspace/file.pli",
      );
    });
  });
});

describe("UriUtils.composeRelativePath", () => {
  test("prefixes with ./ when result is relative", () => {
    expect(
      UriUtils.composeRelativePath("/workspace", "/workspace/file.pli"),
    ).toBe("./file.pli");
  });

  test("prefixes with ./ for nested relative paths", () => {
    expect(
      UriUtils.composeRelativePath("/workspace", "/workspace/src/main.pli"),
    ).toBe("./src/main.pli");
  });

  test("returns absolute fallback when paths share no common workspace", () => {
    const result = UriUtils.composeRelativePath("/a/b/c", "/d/e/f.pli");
    expect(result).toBe("/d/e/f.pli");
  });

  test("returns fallback with drive letter when drives differ", () => {
    const result = UriUtils.composeRelativePath(
      "C:/workspace",
      "D:/other/file.pli",
    );
    expect(result).toBe("D:/other/file.pli");
  });

  test("uses explicit fallback parameter when provided", () => {
    const result = UriUtils.composeRelativePath(
      "C:/workspace",
      "D:/other/file.pli",
      "D:/custom/fallback.pli",
    );
    expect(result).toBe("D:/custom/fallback.pli");
  });

  test("handles from being the filesystem root", () => {
    expect(UriUtils.composeRelativePath("/", "/workspace/file.pli")).toBe(
      "./workspace/file.pli",
    );
  });
});

describe("UriUtils.workspaceRelativeEntryPath", () => {
  test("preserves original casing of the workspace-relative path", () => {
    expect(
      UriUtils.workspaceRelativeEntryPath(
        "/Users/dev/Project",
        "/Users/dev/Project/SOURCE/Foo.pli",
      ),
    ).toBe("SOURCE/Foo.pli");
  });

  test("matches the workspace prefix case-insensitively", () => {
    // Same file/workspace, but the workspace prefix casing differs from the
    // entry's (as can happen on case-insensitive file systems). The relative
    // remainder must still keep its own original casing.
    expect(
      UriUtils.workspaceRelativeEntryPath(
        "/users/DEV/project",
        "/Users/dev/Project/SOURCE/Foo.pli",
      ),
    ).toBe("SOURCE/Foo.pli");
  });

  test("normalizes Windows backslashes while preserving casing", () => {
    expect(
      UriUtils.workspaceRelativeEntryPath(
        "C:\\Users\\Dev\\Project",
        "C:\\Users\\Dev\\Project\\SOURCE\\Foo.pli",
      ),
    ).toBe("SOURCE/Foo.pli");
  });

  test("returns the absolute file path when entry is outside the workspace", () => {
    expect(
      UriUtils.workspaceRelativeEntryPath(
        "/Users/dev/project",
        "/Users/dev/other/Foo.pli",
      ),
    ).toBe("/Users/dev/other/Foo.pli");
  });

  test("accepts URI string inputs and strips the scheme", () => {
    expect(
      UriUtils.workspaceRelativeEntryPath(
        "file:///workspace",
        "file:///workspace/SOURCE/Foo.pli",
      ),
    ).toBe("SOURCE/Foo.pli");
  });
});

describe("UriUtils.computeWorkspaceRelativeParentFolder", () => {
  const workspace = UriUtils.toUri("/repo/Project");

  test("preserves the original casing of the parent lib folder", () => {
    expect(
      UriUtils.computeWorkspaceRelativeParentFolder(
        UriUtils.toUri("/repo/Project/CopyBooks/Common/Foo.inc"),
        workspace,
      ),
    ).toBe("CopyBooks/Common");
  });

  test("detects workspace membership case-insensitively", () => {
    // Workspace prefix casing differs from the candidate's; membership must
    // still be detected while the folder keeps the candidate's casing.
    expect(
      UriUtils.computeWorkspaceRelativeParentFolder(
        UriUtils.toUri("/repo/Project/CopyBooks/Foo.inc"),
        UriUtils.toUri("/REPO/project"),
      ),
    ).toBe("CopyBooks");
  });

  test("returns undefined when the candidate is outside the workspace", () => {
    expect(
      UriUtils.computeWorkspaceRelativeParentFolder(
        UriUtils.toUri("/repo/Other/Foo.inc"),
        workspace,
      ),
    ).toBeUndefined();
  });

  test("returns empty string when the candidate is in the workspace root", () => {
    expect(
      UriUtils.computeWorkspaceRelativeParentFolder(
        UriUtils.toUri("/repo/Project/Foo.inc"),
        workspace,
      ),
    ).toBe("");
  });
});
