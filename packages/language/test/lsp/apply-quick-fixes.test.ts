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
} from "../../src/workspace/plugin-configuration-provider";
import { UriUtils } from "../../src/utils/uri";
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
