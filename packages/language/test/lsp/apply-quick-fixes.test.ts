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

import { describe, test, expect, beforeEach } from "vitest";
import { Diagnostic } from "vscode-languageserver-types";
import {
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import {
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
  deserializeProcessGroup,
  type PluginConfigUnresolvedLibData,
} from "../../src/workspace/plugin-configuration-provider";
import type { JSONPath } from "../../src/utils/jsonc";
import { URI, UriUtils } from "../../src/utils/uri";
import * as applyQuickFixes from "../../src/language-server/code-actions/apply-quick-fixes";
import { PLICodes } from "../../src/validation/pli-codes";
import { LspCodes } from "../../src/validation/lsp-codes";
import { Commands } from "../../src/language-server/constants";
import { fullCode } from "../../src/language-server/types";

let vfs: VirtualFileSystemProvider;
let pluginConfig: PluginConfigurationProvider;

beforeEach(async () => {
  // Reset in-memory providers
  vfs = new VirtualFileSystemProvider();
  pluginConfig = new PluginConfigurationProvider();
  setFileSystemProvider(vfs);
  setPluginConfigurationProvider(pluginConfig);

  // Base config setup
  const processGroup = deserializeProcessGroup({
    name: "default",
    "include-extensions": [".inc"],
    libs: [],
  });
  await vfs.writeFile(
    UriUtils.toUri("/workspace/.pliplugin/proc_grps.json"),
    JSON.stringify({
      pgroups: [
        {
          name: "default",
          "include-extensions": [".inc"],
          libs: [],
        },
      ],
    }),
  );
  await pluginConfig.init("/workspace");
  await pluginConfig.setProcessGroupConfigs([processGroup]);
  pluginConfig.setProgramConfigs("/workspace", [
    { program: "main.pli", pgroup: "default" },
  ]);
});

const CODE_UNRESOLVED_LIB = fullCode(
  LspCodes.PluginConfiguration.UnresolvedEntry,
);

function procGrpsDocumentUri(): string {
  return UriUtils.joinPath(
    UriUtils.toUri(pluginConfig.getWorkspacePath()),
    ".pliplugin",
    "proc_grps.json",
  ).toString();
}

function unresolvedLibDiagnostic(
  lib: string,
  pgroup = "default",
  path?: JSONPath,
): Diagnostic {
  return {
    code: CODE_UNRESOLVED_LIB,
    message: `unresolved ${lib}`,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 1 },
    },
    data: { lib, pgroup, path } as PluginConfigUnresolvedLibData,
  } as Diagnostic;
}

function procGrpsJsonText(libs: string[]): string {
  return JSON.stringify(
    {
      pgroups: [
        {
          name: "default",
          "include-extensions": [".inc"],
          libs,
        },
      ],
    },
    undefined,
    2,
  );
}

function procGrpsUri(): URI {
  return UriUtils.toUri(procGrpsDocumentUri());
}

async function setupParsedProcGrps(libs: string[]): Promise<void> {
  const procGrpsJson = JSON.stringify(
    {
      pgroups: [
        {
          name: "default",
          "include-extensions": [".inc"],
          libs,
        },
      ],
    },
    undefined,
    2,
  );
  await vfs.writeFile(
    UriUtils.toUri("/workspace/.pliplugin/proc_grps.json"),
    procGrpsJson,
  );
  await pluginConfig.parseProcessGroupConfigs(procGrpsJson);
}

//
// ----------------------------------------------------------
// quickFixResolveInclude tests
// ----------------------------------------------------------
describe("quickFixResolveInclude", () => {
  test("returns undefined when no unresolved file in diagnostic", async () => {
    const diagnostic = {
      data: { entryUri: "file:///workspace/main.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("returns undefined when no process group config", async () => {
    const diagnostic = {
      data: {
        unresolvedFile: "file:///some/file",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;

    // Remove all configs
    await pluginConfig.setProcessGroupConfigs([]);
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("returns undefined when file not found", async () => {
    const diagnostic = {
      data: {
        unresolvedFile: "file:///missing/file",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("returns undefined when folder already in Libs", async () => {
    // Write file in virtual FS
    await vfs.writeFile(UriUtils.toUri("workspace/libs/missing.inc"), "");
    const cfg = deserializeProcessGroup({
      name: "default",
      libs: ["libs"],
      "include-extensions": [".inc"],
    });
    await pluginConfig.setProcessGroupConfigs([cfg]);

    const diagnostic = {
      data: {
        unresolvedFile: "file:///missing.inc",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("returns valid CodeAction when all conditions are met", async () => {
    await vfs.writeFile(UriUtils.toUri("/workspace/libs/missing.inc"), "");
    const diagnostic = {
      data: {
        unresolvedFile: "file:///missing.inc",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);

    expect(result).toBeDefined();
    expect(result!.kind).toBe("quickfix");
    expect(result!.title).toContain("Add");
    expect(result!.command!.command).toBe(Commands.RESOLVE_INCLUDE);
  });

  test("returns valid CodeAction when all conditions are met and there are more than one pgroup entry", async () => {
    await vfs.writeFile(UriUtils.toUri("/workspace/nested/missing.inc"), "");
    await vfs.writeFile(
      UriUtils.toUri("/workspace/.pliplugin/proc_grps.json"),
      JSON.stringify({
        pgroups: [
          {
            name: "default",
            "include-extensions": [".inc"],
            libs: [],
          },
          {
            name: "custom",
            "include-extensions": [".inc"],
            libs: [],
          },
        ],
      }),
    );
    const diagnostic = {
      data: {
        unresolvedFile: "file:///workspace/nested/missing.inc",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);

    expect(result).toBeDefined();
    expect(result!.kind).toBe("quickfix");
    expect(result!.title).toContain("Add");
    expect(result!.command!.command).toBe(Commands.RESOLVE_INCLUDE);
    expect(result!.command!.arguments![1]).toEqual(
      JSON.stringify(
        {
          pgroups: [
            {
              name: "default",
              "include-extensions": [".inc"],
              libs: ["nested"],
            },
            {
              name: "custom",
              "include-extensions": [".inc"],
              libs: [],
            },
          ],
        },
        undefined,
        2,
      ),
    );
  });
});

//
// ----------------------------------------------------------
// quickFixCreateConfig tests
// ----------------------------------------------------------
describe("quickFixCreateConfig", () => {
  test("returns undefined when entryUri is missing", async () => {
    const diagnostic = { data: {} } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);
    expect(result).toBeUndefined();
  });

  test("returns valid CodeAction when entryUri provided", async () => {
    const diagnostic = {
      data: { entryUri: "/workspace/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe("foo.pli");
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });

  test("returns valid CodeAction when nested entryUri provided", async () => {
    const diagnostic = {
      data: { entryUri: "/workspace/nested/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe("nested/foo.pli");
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });

  test("returns valid CodeAction when absolute UNIX entryUri provided", async () => {
    const diagnostic = {
      data: { entryUri: "/Users/mockUser/mockFolder/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });

  test("returns valid CodeAction when absolute UNIX entryUri with file schema is provided", async () => {
    const diagnostic = {
      data: { entryUri: "file:///Users/mockUser/mockFolder/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });

  test("returns valid CodeAction when absolute Windows entryUri with schema provided already normalized", async () => {
    const diagnostic = {
      data: { entryUri: "file:///C:/Users/mockUser/mockFolder/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "C:/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });

  test("returns valid CodeAction when absolute Windows entryUri provided", async () => {
    const diagnostic = {
      data: { entryUri: "C:\\Users\\mockUser\\mockFolder\\foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "C:/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });
  test("returns valid CodeAction when absolute Windows entryUri provided already normalized", async () => {
    const diagnostic = {
      data: { entryUri: "C:/Users/mockUser/mockFolder/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "C:/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });
  test("returns valid CodeAction when entryUri is outside (above) the workspace", async () => {
    pluginConfig.setProgramConfigs("/Users/mockUser/workspace", [
      { program: "main.pli", pgroup: "default" },
    ]);
    const diagnostic = {
      data: { entryUri: "/Users/mockUser/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe("/Users/mockUser/foo.pli");
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });
});

//
// ----------------------------------------------------------
// applyQuickFixes tests
// ----------------------------------------------------------
describe("applyQuickFixes", () => {
  test("returns code actions only for unresolved include (IBM3841I) diagnostics", async () => {
    await vfs.writeFile(UriUtils.toUri("/workspace/some/file1.inc"), "");
    await vfs.writeFile(UriUtils.toUri("/workspace/some/file2.inc"), "");
    const diagnostics = [
      {
        code: fullCode(PLICodes.Severe.IBM1848I),
        data: { unresolvedFile: "file1.inc", entryUri: "/workspace/main.pli" },
      },
      {
        // There's no quick fix for this diag (05.11.2025)
        code: fullCode(PLICodes.Severe.IBM3842I),
        data: {},
      },
      {
        code: fullCode(PLICodes.Severe.IBM1848I),
        data: { unresolvedFile: "file2.inc", entryUri: "/workspace/main.pli" },
      },
    ] as Diagnostic[];

    const result = await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(result).toHaveLength(2);
    expect(result![0].kind).toBe("quickfix");
    expect(result![1].kind).toBe("quickfix");
  });

  test("returns config quick fix for missing configuration (LSPIR001) diagnostic", async () => {
    const diagnostics = [
      {
        code: fullCode(LspCodes.IncludeResolution.MissingConfiguration),
        data: { entryUri: "/workspace/foo.pli" },
      },
    ] as Diagnostic[];

    const result = await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(result).toHaveLength(1);
    expect(result![0].title).toContain(
      "Create a startup configuration for this file.",
    );
  });

  test("returns undefined when no recognized diagnostics", async () => {
    const diagnostics = [
      { code: "UNKNOWN_CODE" } as Diagnostic,
      { code: undefined } as Diagnostic,
    ];

    const result = await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(result).toBeUndefined();
  });

  test("combines multiple quick fixes (include(IBM3841I) + config(LSPIR001) and a diagnostic with no quick fix.)", async () => {
    await vfs.writeFile(UriUtils.toUri("/workspace/libs/missing.inc"), "");
    const diagnostics = [
      {
        code: fullCode(PLICodes.Severe.IBM1848I),
        data: {
          unresolvedFile: "missing.inc",
          entryUri: "/workspace/main.pli",
        },
      },
      {
        code: fullCode(LspCodes.IncludeResolution.MissingConfiguration),
        data: { entryUri: "/workspace/foo.pli" },
      },
      {
        // There's no quick fix for this diag (05.11.2025)
        code: fullCode(PLICodes.Severe.IBM3842I),
        data: {},
      },
    ] as Diagnostic[];

    const result = await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(result).toHaveLength(2);
  });
});

//
// ----------------------------------------------------------
// quickFixRemoveUnresolvedLib tests
// ----------------------------------------------------------
describe("quickFixRemoveUnresolvedLib", () => {
  test("returns undefined when diagnostic data omits lib or pgroup", async () => {
    expect(
      await applyQuickFixes.quickFixRemoveUnresolvedLib({
        code: CODE_UNRESOLVED_LIB,
        data: { lib: "x" },
      } as Diagnostic),
    ).toBeUndefined();
    expect(
      await applyQuickFixes.quickFixRemoveUnresolvedLib({
        code: CODE_UNRESOLVED_LIB,
        data: { pgroup: "default" },
      } as Diagnostic),
    ).toBeUndefined();
  });

  test("returns undefined when diagnostic data omits path", async () => {
    expect(
      await applyQuickFixes.quickFixRemoveUnresolvedLib(
        unresolvedLibDiagnostic("x"),
      ),
    ).toBeUndefined();
  });

  test("returns undefined when no snapshot exists", async () => {
    const result = await applyQuickFixes.quickFixRemoveUnresolvedLib(
      unresolvedLibDiagnostic("x", "default", ["pgroups", 0, "libs", 0]),
    );
    expect(result).toBeUndefined();
  });

  test("returns REMOVE_DEAD_LIB action that drops the matching libs entry", async () => {
    await setupParsedProcGrps(["keep-me", "drop-me", "also-keep"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    const badEntry = snapshot!.entries.find((e) => e.lib === "drop-me");

    const action = await applyQuickFixes.quickFixRemoveUnresolvedLib(
      unresolvedLibDiagnostic("drop-me", "default", badEntry!.path),
    );
    expect(action).toBeDefined();
    expect(action!.command!.command).toBe(Commands.REMOVE_DEAD_LIB);
    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { name: string; libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual(["keep-me", "also-keep"]);
  });
});

//
// ----------------------------------------------------------
// quickFixRemoveAllUnresolvedLibs tests
// ----------------------------------------------------------
describe("quickFixRemoveAllUnresolvedLibs", () => {
  test("returns undefined when fewer than two unique entries", async () => {
    const text = procGrpsJsonText(["a"]);
    const uri = procGrpsUri();
    expect(
      await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
        [{ lib: "a", pgroup: "default", path: ["pgroups", 0, "libs", 0] }],
        text,
        uri,
        [],
      ),
    ).toBeUndefined();

    expect(
      await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
        [
          {
            lib: "same",
            pgroup: "default",
            path: ["pgroups", 0, "libs", 0],
          },
          {
            lib: "same",
            pgroup: "default",
            path: ["pgroups", 0, "libs", 0],
          },
        ],
        text,
        uri,
        [],
      ),
    ).toBeUndefined();
  });

  test("returns undefined when entries have no paths", async () => {
    const text = procGrpsJsonText(["a", "b"]);
    const uri = procGrpsUri();
    expect(
      await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
        [
          { lib: "a", pgroup: "default" },
          { lib: "b", pgroup: "default" },
        ],
        text,
        uri,
        [],
      ),
    ).toBeUndefined();
  });

  test("removes every unique entry in one command and deduplicates input", async () => {
    const text = procGrpsJsonText(["w", "x", "y", "z"]);
    const uri = procGrpsUri();

    const action = await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
      [
        { lib: "x", pgroup: "default", path: ["pgroups", 0, "libs", 1] },
        { lib: "y", pgroup: "default", path: ["pgroups", 0, "libs", 2] },
        { lib: "x", pgroup: "default", path: ["pgroups", 0, "libs", 1] },
      ],
      text,
      uri,
      [],
    );
    expect(action).toBeDefined();
    expect(action!.title).toContain("Remove all 2 unresolved libraries");
    expect(action!.command!.command).toBe(Commands.REMOVE_DEAD_LIB);
    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual(["w", "z"]);
  });

  test("path-aware remove-all removes duplicate libs from right to left", async () => {
    const text = procGrpsJsonText(["dup", "keep", "dup"]);
    const uri = procGrpsUri();

    const action = await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
      [
        { lib: "dup", pgroup: "default", path: ["pgroups", 0, "libs", 0] },
        { lib: "dup", pgroup: "default", path: ["pgroups", 0, "libs", 2] },
      ],
      text,
      uri,
      [],
    );

    expect(action).toBeDefined();
    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual(["keep"]);
  });
});

//
// ----------------------------------------------------------
// applyQuickFixes (proc_grps.json + proc_grps snapshot)
// ----------------------------------------------------------
describe("applyQuickFixes unresolved lib / proc_grps snapshot", () => {
  test("with proc_grps documentUri and snapshot: yields bulk remove-all from snapshot plus individual removes from context diagnostics", async () => {
    await setupParsedProcGrps(["bad-a", "bad-b", "bad-c"]);

    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(3);

    const result = await applyQuickFixes.applyQuickFixes(
      [unresolvedLibDiagnostic("bad-a", "default", snapshot!.entries[0].path)],
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(2);

    const removeAll = result!.find((a) =>
      a.title.startsWith("Remove all 3 unresolved"),
    );
    expect(removeAll).toBeDefined();
    const single = result!.filter((a) =>
      a.title.startsWith("Remove unresolved library"),
    );
    expect(single).toHaveLength(1);
    expect(single[0].title).toEqual("Remove unresolved library 'bad-a'.");
    const allContent = removeAll!.command!.arguments![1] as string;
    expect(JSON.parse(allContent).pgroups[0].libs).toEqual([]);
  });

  test("with proc_grps documentUri and single snapshot entry: remove-all is omitted", async () => {
    await setupParsedProcGrps(["only-bad"]);

    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(1);

    const result = await applyQuickFixes.applyQuickFixes(
      [
        unresolvedLibDiagnostic("only-bad", "default", [
          "pgroups",
          0,
          "libs",
          0,
        ]),
      ],
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].title).toBe("Remove unresolved library 'only-bad'.");
  });

  test("without proc_grps documentUri: uses per-diagnostic path only", async () => {
    await setupParsedProcGrps(["solo-bad"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();

    const result = await applyQuickFixes.applyQuickFixes([
      unresolvedLibDiagnostic("solo-bad", "default", snapshot!.entries[0].path),
    ]);
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].command!.command).toBe(Commands.REMOVE_DEAD_LIB);
  });

  test("with proc_grps URI but no unresolved lib in context: no unresolved-lib actions", async () => {
    await setupParsedProcGrps(["bad-x"]);

    const result = await applyQuickFixes.applyQuickFixes(
      [
        {
          code: fullCode(LspCodes.IncludeResolution.MissingConfiguration),
          data: { entryUri: "/workspace/foo.pli" },
        } as Diagnostic,
      ],
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].title).toContain("Create a startup configuration");
  });
});

//
// ----------------------------------------------------------
// parseProcessGroupConfigs → metadata-driven quick fixes
// These tests exercise the real parsing path to ensure
// metadata paths are root-relative and quick fixes produce
// actual content changes (not no-ops).
// ----------------------------------------------------------
describe("metadata-driven quick fixes via parseProcessGroupConfigs", () => {
  test("parseProcessGroupConfigs stores root-relative paths in snapshot entries", async () => {
    await setupParsedProcGrps(["nonexistent-a", "nonexistent-b"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(2);

    for (const entry of snapshot!.entries) {
      expect(entry.path).toBeDefined();
      expect(entry.path![0]).toBe("pgroups");
      expect(typeof entry.path![1]).toBe("number");
      expect(entry.path![2]).toBe("libs");
      expect(typeof entry.path![3]).toBe("number");
    }
  });

  test("snapshot bundles entries, text, and uri from the same parse", async () => {
    await setupParsedProcGrps(["bad-a", "bad-b"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(2);
    expect(snapshot!.text).toContain('"bad-a"');
    expect(snapshot!.text).toContain('"bad-b"');
    expect(snapshot!.uri.toString()).toContain("proc_grps.json");
  });

  test("single remove via parsed metadata actually changes content", async () => {
    await setupParsedProcGrps(["keep-me", "bad-lib"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    const badEntry = snapshot!.entries.find((e) => e.lib === "bad-lib");
    expect(badEntry).toBeDefined();
    expect(badEntry!.path).toBeDefined();

    const diag = unresolvedLibDiagnostic("bad-lib");
    diag.data.path = badEntry!.path;

    const action = await applyQuickFixes.quickFixRemoveUnresolvedLib(diag);
    expect(action).toBeDefined();
    expect(action!.command!.command).toBe(Commands.REMOVE_DEAD_LIB);

    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual(["keep-me"]);
  });

  test("remove-all via parsed metadata removes all invalid libs", async () => {
    await setupParsedProcGrps(["bad-a", "bad-b", "bad-c"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(3);
    expect(snapshot!.entries.every((e) => e.path !== undefined)).toBe(true);

    const action = await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
      snapshot!.entries,
      snapshot!.text,
      snapshot!.uri,
      [],
    );
    expect(action).toBeDefined();
    expect(action!.title).toContain("Remove all 3 unresolved");

    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual([]);
  });

  test("duplicate libs via parsed metadata get distinct root-relative paths", async () => {
    await vfs.writeFile(UriUtils.toUri("/workspace/keep/.placeholder"), "");
    await setupParsedProcGrps(["dup", "keep", "dup"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    const dupEntries = snapshot!.entries.filter((e) => e.lib === "dup");
    expect(dupEntries).toHaveLength(2);

    expect(dupEntries[0].path).toEqual(["pgroups", 0, "libs", 0]);
    expect(dupEntries[1].path).toEqual(["pgroups", 0, "libs", 2]);

    const action = await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
      snapshot!.entries,
      snapshot!.text,
      snapshot!.uri,
      [],
    );
    expect(action).toBeDefined();

    const newContent = action!.command!.arguments![1] as string;
    const parsed = JSON.parse(newContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsed.pgroups[0].libs).toEqual(["keep"]);
  });

  test("end-to-end: applyQuickFixes with parsed metadata yields working quick fixes", async () => {
    await setupParsedProcGrps(["valid-should-fail", "another-bad"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(2);

    const diagA: Diagnostic = {
      code: CODE_UNRESOLVED_LIB,
      message: "unresolved valid-should-fail",
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 },
      },
      data: snapshot!.entries[0],
    } as Diagnostic;

    const result = await applyQuickFixes.applyQuickFixes(
      [diagA],
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();

    const removeAll = result!.find((a) => a.title.startsWith("Remove all"));
    expect(removeAll).toBeDefined();
    const removeAllContent = removeAll!.command!.arguments![1] as string;
    const parsedAll = JSON.parse(removeAllContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsedAll.pgroups[0].libs).toEqual([]);

    const single = result!.filter((a) =>
      a.title.startsWith("Remove unresolved library"),
    );
    expect(single).toHaveLength(1);
    const singleContent = single[0].command!.arguments![1] as string;
    const parsedSingle = JSON.parse(singleContent) as {
      pgroups: { libs: string[] }[];
    };
    expect(parsedSingle.pgroups[0].libs).toHaveLength(1);
  });

  test("multi-pgroup parsed metadata has correct root-relative paths", async () => {
    const procGrpsJson = JSON.stringify(
      {
        pgroups: [
          {
            name: "group-a",
            "include-extensions": [".inc"],
            libs: ["valid-dir"],
          },
          {
            name: "group-b",
            "include-extensions": [".inc"],
            libs: ["nonexistent"],
          },
        ],
      },
      undefined,
      2,
    );
    await vfs.writeFile(
      UriUtils.toUri("/workspace/.pliplugin/proc_grps.json"),
      procGrpsJson,
    );
    await vfs.writeFile(
      UriUtils.toUri("/workspace/valid-dir/.placeholder"),
      "",
    );
    await pluginConfig.parseProcessGroupConfigs(procGrpsJson);
    pluginConfig.setProgramConfigs("/workspace", [
      { program: "main.pli", pgroup: "group-a" },
      { program: "other.pli", pgroup: "group-b" },
    ]);

    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(1);
    expect(snapshot!.entries[0].lib).toBe("nonexistent");
    expect(snapshot!.entries[0].pgroup).toBe("group-b");
    expect(snapshot!.entries[0].path).toEqual(["pgroups", 1, "libs", 0]);
  });
});
