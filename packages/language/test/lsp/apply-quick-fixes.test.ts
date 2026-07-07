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
import { CodeAction, Diagnostic } from "vscode-languageserver-types";
import { TextDocument } from "vscode-languageserver-textdocument";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import {
  PluginConfigurationProvider,
  ProcGrpsSnapshot,
  deserializeProcessGroup,
  type PluginConfigUnresolvedLibData,
} from "../../src/workspace/plugin-configuration-provider";
import { PluginConfiguration } from "../../src/language-server/constants";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import type { JSONPath } from "../../src/utils/jsonc";
import { UriUtils } from "../../src/utils/uri";
import * as applyQuickFixes from "../../src/language-server/code-actions/apply-quick-fixes";
import { PLICodes } from "../../src/validation/pli-codes";
import { LspCodes } from "../../src/validation/lsp-codes";
import { Commands } from "../../src/language-server/constants";
import { fullCode } from "../../src/language-server/types";
import { makeProgramConfig } from "../config-fixtures";
import { resetDocumentProviders } from "../../src/language-server/text-documents";

let vfs: VirtualFileSystemProvider;
let pluginConfig: PluginConfigurationProvider;
let workspace: WorkspaceContext;

beforeEach(async () => {
  // Reset in-memory providers
  vfs = new VirtualFileSystemProvider();
  workspace = new WorkspaceContext(vfs);
  resetDocumentProviders(vfs);
  pluginConfig = workspace.config;
  await setupParsedProcGrps([]);
});

const CODE_UNRESOLVED_LIB = fullCode(
  LspCodes.PluginConfiguration.UnresolvedEntry,
);

function procGrpsDocumentUri(): string {
  return UriUtils.joinPath(
    pluginConfig.getWorkspacePath(),
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

async function setupParsedProcGrps(libs: string[]): Promise<string> {
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
  const uri = UriUtils.toUri("/workspace/.pliplugin/proc_grps.json");
  await vfs.writeFile(uri, procGrpsJson);
  await vfs.writeFile(
    UriUtils.toUri("/workspace/.pliplugin/pgm_conf.json"),
    JSON.stringify(PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT),
  );
  await pluginConfig.init(UriUtils.toUri("/workspace"));
  return uri.toString();
}

/**
 * Applies a code action's `.edit` for the given source `uri` to `text` and
 * returns the parsed JSON result. Quick fixes now express their change as a
 * WorkspaceEdit (+ a save command) rather than carrying the new content in a
 * command argument, so tests reconstruct the new content by applying the edit.
 */
function applyActionEdit(text: string, action: CodeAction, uri: string): any {
  const newContent = TextDocument.applyEdits(
    TextDocument.create(uri, "json", 0, text),
    action.edit!.changes![uri],
  );
  return JSON.parse(newContent);
}

/**
 * Parses a proc_grps.json with the given pgroups and returns the resulting
 * snapshot. Any lib in `resolvable` is backed by a real directory so it
 * resolves; every other lib becomes an unresolved-lib entry carrying the
 * provider-computed `libsPath`/`survivingLibs`. Lets remove-all tests drive
 * through the real parse instead of hand-building those fields.
 */
async function parsedSnapshot(
  pgroups: { name: string; libs: string[] }[],
  resolvable: string[] = [],
): Promise<ProcGrpsSnapshot> {
  for (const lib of resolvable) {
    await vfs.writeFile(UriUtils.toUri(`/workspace/${lib}/.placeholder`), "");
  }
  await vfs.writeFile(
    UriUtils.toUri("/workspace/.pliplugin/proc_grps.json"),
    JSON.stringify(
      {
        pgroups: pgroups.map((g) => ({ ...g, "include-extensions": [".inc"] })),
      },
      undefined,
      2,
    ),
  );
  await vfs.writeFile(
    UriUtils.toUri("/workspace/.pliplugin/pgm_conf.json"),
    JSON.stringify(PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT),
  );
  await pluginConfig.init(UriUtils.toUri("/workspace"));
  return pluginConfig.getLastProcGrpsSnapshot()!;
}

/** Runs the bulk remove-all quick fix against a parsed snapshot. */
function removeAllFromSnapshot(
  snapshot: Readonly<ProcGrpsSnapshot>,
): Promise<CodeAction | undefined> {
  return applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
    snapshot.entries,
    snapshot.text,
    snapshot.uri,
    [],
  );
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
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );
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
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined when file not found", async () => {
    const diagnostic = {
      data: {
        unresolvedFile: "file:///missing/file",
        entryUri: "file:///workspace/main.pli",
      },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );
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
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );
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
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );

    expect(result).toBeDefined();
    expect(result!.kind).toBe("quickfix");
    expect(result!.title).toContain("Add");
    expect(result!.edit).toBeDefined();
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
    const result = await applyQuickFixes.quickFixResolveInclude(
      diagnostic,
      workspace,
    );

    expect(result).toBeDefined();
    expect(result!.kind).toBe("quickfix");
    expect(result!.title).toContain("Add");
    expect(result!.edit).toBeDefined();
  });
});

//
// ----------------------------------------------------------
// quickFixCreateConfig tests
// ----------------------------------------------------------
describe("quickFixCreateConfig", () => {
  test("returns undefined when entryUri is missing", async () => {
    const diagnostic = { data: {} } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );
    expect(result).toBeUndefined();
  });

  test("returns valid CodeAction when entryUri provided", async () => {
    const diagnostic = {
      data: { entryUri: "/workspace/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

    expect(result).toBeDefined();
    expect(result!.title).toContain("Create a startup configuration");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.arguments![0]).toBe(
      "C:/Users/mockUser/mockFolder/foo.pli",
    );
    expect(result!.command!.command).toBe(Commands.CREATE_CONFIG);
  });
  test("returns valid CodeAction when entryUri is outside (above) the workspace", async () => {
    pluginConfig.setProgramConfigs(
      UriUtils.toUri("/Users/mockUser/workspace"),
      [makeProgramConfig({ program: "main.pli", pgroup: "default" })],
    );
    const diagnostic = {
      data: { entryUri: "/Users/mockUser/foo.pli" },
    } as Diagnostic;
    const result = await applyQuickFixes.quickFixCreateConfig(
      diagnostic,
      workspace,
    );

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

    const result = await applyQuickFixes.applyQuickFixes(
      diagnostics,
      workspace,
      "",
    );
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

    const result = await applyQuickFixes.applyQuickFixes(
      diagnostics,
      workspace,
      "",
    );
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

    const result = await applyQuickFixes.applyQuickFixes(
      diagnostics,
      workspace,
      "",
    );
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

    const result = await applyQuickFixes.applyQuickFixes(
      diagnostics,
      workspace,
      "",
    );
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
      await applyQuickFixes.quickFixRemoveUnresolvedLib(
        {
          code: CODE_UNRESOLVED_LIB,
          data: { lib: "x" },
        } as Diagnostic,
        workspace,
      ),
    ).toBeUndefined();
    expect(
      await applyQuickFixes.quickFixRemoveUnresolvedLib(
        {
          code: CODE_UNRESOLVED_LIB,
          data: { pgroup: "default" },
        } as Diagnostic,
        workspace,
      ),
    ).toBeUndefined();
  });

  test("returns undefined when diagnostic data omits path", async () => {
    expect(
      await applyQuickFixes.quickFixRemoveUnresolvedLib(
        unresolvedLibDiagnostic("x"),
        workspace,
      ),
    ).toBeUndefined();
  });

  test("returns undefined when no snapshot exists", async () => {
    const result = await applyQuickFixes.quickFixRemoveUnresolvedLib(
      unresolvedLibDiagnostic("x", "default", ["pgroups", 0, "libs", 0]),
      workspace,
    );
    expect(result).toBeUndefined();
  });

  test("returns REMOVE_DEAD_LIB action that drops the matching libs entry", async () => {
    await setupParsedProcGrps(["keep-me", "drop-me", "also-keep"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    const badEntry = snapshot!.entries.find((e) => e.lib === "drop-me");

    const action = await applyQuickFixes.quickFixRemoveUnresolvedLib(
      unresolvedLibDiagnostic("drop-me", "default", badEntry!.path),
      workspace,
    );
    expect(action).toBeDefined();
    expect(action!.edit).toBeDefined();
    expect(action!.command!.command).toBe(Commands.SAVE_FILES);
    expect(action!.command!.arguments![0]).toEqual([snapshot!.uri.toString()]);
    const parsed = applyActionEdit(
      snapshot!.text,
      action!,
      snapshot!.uri.toString(),
    ) as { pgroups: { name: string; libs: string[] }[] };
    expect(parsed.pgroups[0].libs).toEqual(["keep-me", "also-keep"]);
  });
});

//
// ----------------------------------------------------------
// quickFixRemoveAllUnresolvedLibs tests
// ----------------------------------------------------------
describe("quickFixRemoveAllUnresolvedLibs", () => {
  test("removes every unresolved lib while keeping the resolved ones", async () => {
    const snapshot = await parsedSnapshot(
      [{ name: "default", libs: ["w", "x", "y", "z"] }],
      ["w", "z"],
    );
    const uri = snapshot.uri.toString();

    const action = await removeAllFromSnapshot(snapshot);

    expect(action).toBeDefined();
    expect(action!.title).toContain("Remove all 2 unresolved libraries");
    expect(action!.edit).toBeDefined();
    expect(action!.command!.command).toBe(Commands.SAVE_FILES);
    expect(action!.command!.arguments![0]).toEqual([uri]);
    expect(
      applyActionEdit(snapshot.text, action!, uri).pgroups[0].libs,
    ).toEqual(["w", "z"]);
  });

  test("removes duplicate unresolved libs but keeps a resolved namesake", async () => {
    const snapshot = await parsedSnapshot(
      [{ name: "default", libs: ["dup", "keep", "dup"] }],
      ["keep"],
    );
    const uri = snapshot.uri.toString();

    const action = await removeAllFromSnapshot(snapshot);

    expect(action).toBeDefined();
    expect(
      applyActionEdit(snapshot.text, action!, uri).pgroups[0].libs,
    ).toEqual(["keep"]);
  });

  test("removes unresolved libs from every process group (multi-pgroup)", async () => {
    const snapshot = await parsedSnapshot(
      [
        { name: "a", libs: ["good-a", "bad-a"] },
        { name: "b", libs: ["bad-b", "good-b"] },
      ],
      ["good-a", "good-b"],
    );
    const uri = snapshot.uri.toString();

    const action = await removeAllFromSnapshot(snapshot);

    expect(action).toBeDefined();
    expect(action!.command!.arguments![0]).toEqual([uri]);
    const parsed = applyActionEdit(snapshot.text, action!, uri);
    expect(parsed.pgroups[0].libs).toEqual(["good-a"]);
    expect(parsed.pgroups[1].libs).toEqual(["good-b"]);
  });

  test("rewrites libs nested inside a settings.json source", async () => {
    // Config supplied via VS Code settings: paths are prefixed with the settings
    // container, and the source is settings.json - not proc_grps.json. The
    // settings-loading pipeline needs a live connection, so this case builds the
    // prefixed paths directly rather than driving through the parse.
    const libs = ["good", "bad-1", "bad-2"];
    const text = JSON.stringify(
      { pli: { proc_grps: { pgroups: [{ name: "default", libs }] } } },
      undefined,
      2,
    );
    const uri = UriUtils.toUri("/workspace/.vscode/settings.json");
    const libsPath = ["pli", "proc_grps", "pgroups", 0, "libs"];
    const survivingLibs = ["good"];
    const pairs = [1, 2].map((i) => ({
      lib: libs[i],
      pgroup: "default",
      path: [...libsPath, i],
      libsPath,
      survivingLibs,
    }));

    const action = await applyQuickFixes.quickFixRemoveAllUnresolvedLibs(
      pairs,
      text,
      uri,
      [],
    );

    expect(action).toBeDefined();
    expect(action!.command!.command).toBe(Commands.SAVE_FILES);
    expect(action!.command!.arguments![0]).toEqual([uri.toString()]);
    expect(
      applyActionEdit(text, action!, uri.toString()).pli.proc_grps.pgroups[0]
        .libs,
    ).toEqual(["good"]);
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
      workspace,
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
    const parsedAll = applyActionEdit(
      snapshot!.text,
      removeAll!,
      snapshot!.uri.toString(),
    );
    expect(parsedAll.pgroups[0].libs).toEqual([]);
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
      workspace,
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].title).toBe("Remove unresolved library 'only-bad'.");
  });

  test("without proc_grps documentUri: uses per-diagnostic path only", async () => {
    const uri = await setupParsedProcGrps(["solo-bad"]);
    const snapshot = pluginConfig.getLastProcGrpsSnapshot();

    const result = await applyQuickFixes.applyQuickFixes(
      [
        unresolvedLibDiagnostic(
          "solo-bad",
          "default",
          snapshot!.entries[0].path,
        ),
      ],
      workspace,
      uri,
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].edit).toBeDefined();
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
      workspace,
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].title).toContain("Create a startup configuration");
  });
});

//
// ----------------------------------------------------------
// parseProcessGroupConfigs -> metadata-driven quick fixes
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

    const action = await applyQuickFixes.quickFixRemoveUnresolvedLib(
      diag,
      workspace,
    );
    expect(action).toBeDefined();
    expect(action!.edit).toBeDefined();

    const parsed = applyActionEdit(
      snapshot!.text,
      action!,
      snapshot!.uri.toString(),
    );
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

    const parsed = applyActionEdit(
      snapshot!.text,
      action!,
      snapshot!.uri.toString(),
    );
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

    const parsed = applyActionEdit(
      snapshot!.text,
      action!,
      snapshot!.uri.toString(),
    );
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
      workspace,
      procGrpsDocumentUri(),
    );
    expect(result).toBeDefined();

    const removeAll = result!.find((a) => a.title.startsWith("Remove all"));
    expect(removeAll).toBeDefined();
    const parsedAll = applyActionEdit(
      snapshot!.text,
      removeAll!,
      snapshot!.uri.toString(),
    );
    expect(parsedAll.pgroups[0].libs).toEqual([]);

    const single = result!.filter((a) =>
      a.title.startsWith("Remove unresolved library"),
    );
    expect(single).toHaveLength(1);
    const parsedSingle = applyActionEdit(
      snapshot!.text,
      single[0],
      snapshot!.uri.toString(),
    );
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
    pluginConfig.setProgramConfigs(UriUtils.toUri("/workspace"), [
      makeProgramConfig({ program: "main.pli", pgroup: "group-a" }),
      makeProgramConfig({ program: "other.pli", pgroup: "group-b" }),
    ]);

    const snapshot = pluginConfig.getLastProcGrpsSnapshot();
    expect(snapshot).toBeDefined();
    expect(snapshot!.entries).toHaveLength(1);
    expect(snapshot!.entries[0].lib).toBe("nonexistent");
    expect(snapshot!.entries[0].pgroup).toBe("group-b");
    expect(snapshot!.entries[0].path).toEqual(["pgroups", 1, "libs", 0]);
  });
});

//
// ----------------------------------------------------------
// quickFixReplaceUnknownProcGroup tests
//
// These cover the new code action that reacts to COPC04E
// ("Unknown process group 'X'."): one CodeAction per known
// pgroup name, each performing a precise in-place text
// replacement on the offending substring in pgm_conf.json.
// ----------------------------------------------------------
//
const PGM_CONF_DOCUMENT_URI = "/workspace/.pliplugin/pgm_conf.json";

/**
 * A range that covers a real source substring (e.g. `"doesnotexist"`
 * with quotes — 14 chars). Anything with `end - start > 1` is "real
 * enough" for the handler to act on.
 */
const REAL_RANGE = {
  start: { line: 2, character: 33 },
  end: { line: 2, character: 47 },
};

/**
 * Builds a synthetic Diagnostic for COPC04E. We don't need the real
 * `validatePgroupReferences` output here — the handler only reads
 * `code` and `range`, so a plain object with those two fields is
 * sufficient and keeps each test small.
 */
function unknownPgroupDiagnostic(
  range: typeof REAL_RANGE = REAL_RANGE,
): Diagnostic {
  return {
    code: fullCode(LspCodes.PluginConfiguration.UnknownProcessGroup),
    message: `Unknown process group 'foo'.`,
    range,
  } as Diagnostic;
}

describe("quickFixReplaceUnknownProcGroup", () => {
  test("pgroup names with special characters are JSON-escaped", async () => {
    // A pgroup name containing a double-quote has to be escaped in
    // the replacement text, otherwise we'd write invalid JSON.
    // Reaching for `JSON.stringify` rather than building the quoted
    // string with a template literal gives us this for free; this
    // test pins down that choice so a future "simplification" to
    // `\`"${name}"\`` immediately fails.
    await pluginConfig.setProcessGroupConfigs([
      deserializeProcessGroup({ name: 'weird"name', libs: [] }),
    ]);

    const actions = applyQuickFixes.quickFixReplaceUnknownProcGroup(
      unknownPgroupDiagnostic(),
      workspace,
      PGM_CONF_DOCUMENT_URI,
    );

    expect(actions[0].edit!.changes![PGM_CONF_DOCUMENT_URI][0].newText).toBe(
      `"weird\\"name"`,
    );
  });

  test("returns [] when the diagnostic range is the cross-validation fallback (delta == 1)", () => {
    // Defensive guard. `validatePgroupReferences` falls back to
    // `offsetLengthToRange(0, 1)` — the range [0,0)–[0,1), the
    // document's opening `{` — when a ProgramConfig has no
    // `pgroup.meta` (e.g. a programmatically-built config). Acting on
    // that 1-char range would overwrite the brace and corrupt
    // pgm_conf.json, so the handler's `> 1` guard must refuse.
    //
    // This branch is unreachable from a fourslash fixture (config
    // parsed from text always carries `meta`), so it can only be
    // exercised here with a synthetic range.
    const actions = applyQuickFixes.quickFixReplaceUnknownProcGroup(
      unknownPgroupDiagnostic({
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 },
      }),
      workspace,
      PGM_CONF_DOCUMENT_URI,
    );

    expect(actions).toEqual([]);
  });
});
