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

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { Connection } from "vscode-languageserver";
import { UriUtils } from "../../src/utils/uri";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import {
  isLibsDir,
  ProcessGroup,
} from "../../src/workspace/plugin-configuration-provider";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import { Messages } from "../../src/utils/messages";
import { makeProcessGroup } from "../config-fixtures";
import { Severity } from "../../src/language-server/types";
import { resetDocumentProviders } from "../../src/language-server/text-documents";

/**
 * Minimal connection stub that responds to `config/getGlobal` with the
 * given `GlobalConfig`. Other request/notification methods are no-ops so
 * the provider can run end-to-end without a real LSP transport.
 */
export function makeConnection(global: Messages.GlobalConfig): Connection {
  return {
    sendRequest: async (method: string) => {
      if (method === Messages.GetGlobalConfig.method) return global;
      return undefined;
    },
    sendNotification: async () => {},
    onRequest: () => ({ dispose() {} }),
    onNotification: () => ({ dispose() {} }),
  } as unknown as Connection;
}

describe("Plugin Configuration Tests", () => {
  let vfs: VirtualFileSystemProvider;
  let workspace: WorkspaceContext;

  beforeEach(() => {
    vfs = new VirtualFileSystemProvider();
    workspace = new WorkspaceContext(vfs);
    resetDocumentProviders(vfs);
  });

  afterEach(async () => {
    workspace.config.setProgramConfigs(UriUtils.toUri(""), []);
    await workspace.config.setProcessGroupConfigs([]);
  });

  /**
   * Helper function to create a process group configuration with default values
   */
  function createProcessGroup(name: string, libs: string[]): ProcessGroup {
    return makeProcessGroup({
      name,
      libs,
      includeExtensions: [".inc"],
      checkMargins: false,
      instructionCounterLimit: 5000,
      caseUpperValidation: false,
    });
  }

  test("No libs produce no diagnostics", async () => {
    await workspace.config.init(UriUtils.toUri("file:///"));

    // set up a process group with no libs
    const diagnostics = await workspace.config.setProcessGroupConfigs([
      createProcessGroup("default", []),
    ]);

    expect(diagnostics).toEqual([]);
  });

  test("Valid libs produce no diagnostics", async () => {
    await workspace.config.init(UriUtils.toUri("file:///"));

    // create a virtual directory to satisfy the subsequent libs check
    await workspace.fs.writeFile(
      UriUtils.toUri("file:///libs/existing/dummy.pli"),
      "",
    );

    // set up a process group w/ a libs entry that exists
    const diagnostics = await workspace.config.setProcessGroupConfigs([
      createProcessGroup("default", ["libs/existing"]),
    ]);

    expect(diagnostics).toEqual([]);
  });

  test("Invalid libs produce diagnostics", async () => {
    await workspace.config.init(UriUtils.toUri("file:///"));

    // populate the virtual file system with at least one file so it's not empty
    await workspace.fs.writeFile(UriUtils.toUri("file:///dummy.pli"), "");

    // set up a process group with a libs entry that does not exist
    const diagnostics = await workspace.config.setProcessGroupConfigs([
      createProcessGroup("default", ["nonexistent-libs"]),
    ]);

    // should generate a diagnostic for the non-existing lib
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe("COPC01E");
    expect(diagnostics[0].message).toContain("nonexistent-libs");
    expect(diagnostics[0].severity).toBe(Severity.E); // err
  });

  test("Only invalid libs produce diagnostics, not valid ones", async () => {
    await workspace.config.init(UriUtils.toUri("file:///"));

    await workspace.fs.writeFile(
      UriUtils.toUri("file:///libs/existing1/p1.pli"),
      "",
    );
    await workspace.fs.writeFile(
      UriUtils.toUri("file:///libs/existing2/p2.pli"),
      "",
    );

    const diagnostics = await workspace.config.setProcessGroupConfigs([
      createProcessGroup("default", [
        "libs/existing1",
        "libs/existing2",

        "invalid1",
        "invalid2",
      ]),
    ]);

    // expect diagnostics for the 2 invalid libs only
    expect(diagnostics).toHaveLength(2);

    const d0 = diagnostics[0];
    expect(d0.code).toBe("COPC01E");
    expect(diagnostics.some((d) => d.message.includes("invalid1"))).toBe(true);

    const d1 = diagnostics[1];
    expect(d1.code).toBe("COPC01E");
    expect(diagnostics.some((d) => d.message.includes("invalid2"))).toBe(true);
  });

  test("Duplicate Lib Entries are filtered from $computed props", async () => {
    // ensure that duplicate lib & ddname entries are filtered out from computed props
    const libs = ["lib1/dir1", "lib1/dir1", "lib2/DDNAME", "lib2/DDNAME"];
    const uniqueLibs = Array.from(new Set(libs));

    await workspace.fs.writeFile(
      UriUtils.toUri("file:///lib1/dir1/p1.pli"),
      "",
    );
    await workspace.fs.writeFile(UriUtils.toUri("file:///lib2/DDNAME(p2)"), "");

    // duplicate ddnames should be filtered out in $computedLibDdnamesSet
    await workspace.config.setProcessGroupConfigs([
      makeProcessGroup({
        name: "default",
        libs,
        includeExtensions: [".inc"],
        checkMargins: false,
        instructionCounterLimit: 5000,
        caseUpperValidation: false,
      }),
    ]);

    // ensure computedLibs is present w/ only one of each unique entry (2)
    const processGroup = workspace.config.getProcessGroupConfig("default");
    expect(processGroup).toBeDefined();
    expect(processGroup?.computedLibs).toBeDefined();
    expect(processGroup?.computedLibs.length).toBe(uniqueLibs.length);

    // check the computed dir libs as well
    // should be the one dir entry, not the ddname
    const dirLibs = processGroup!.computedLibs.filter(isLibsDir);
    expect(dirLibs.length).toBe(1);
    expect(dirLibs[0].path).toBe("lib1/dir1");
  });

  describe("Merge of .pliplugin/ and VS Code settings", () => {
    const WORKSPACE = "file:///ws/";
    const SETTINGS_URI = "file:///ws/.vscode/settings.json";

    async function writePluginFiles(
      pgmConfText?: string,
      procGrpsText?: string,
    ): Promise<void> {
      if (pgmConfText !== undefined) {
        await vfs.writeFile(
          UriUtils.toUri("file:///ws/.pliplugin/pgm_conf.json"),
          pgmConfText,
        );
      }
      if (procGrpsText !== undefined) {
        await vfs.writeFile(
          UriUtils.toUri("file:///ws/.pliplugin/proc_grps.json"),
          procGrpsText,
        );
      }
    }

    async function writeSettingsFile(text: string): Promise<void> {
      await vfs.writeFile(UriUtils.toUri(SETTINGS_URI), text);
    }

    function settingsConfig(args: {
      pgmConf?: boolean;
      procGrps?: boolean;
    }): Messages.GlobalConfig {
      const result: Messages.GlobalConfig = {};
      if (args.pgmConf) {
        result.pgmConf = {
          uri: SETTINGS_URI,
          containerPath: [],
          configKey: "pli.pgm_conf",
        };
      }
      if (args.procGrps) {
        result.procGrps = {
          uri: SETTINGS_URI,
          containerPath: [],
          configKey: "pli.proc_grps",
        };
      }
      return result;
    }

    test("Non-overlapping entries from both sources are unioned", async () => {
      await writePluginFiles(
        `{ "pgms": [{ "program": "a.pli", "pgroup": "plugin-grp" }] }`,
        `{ "pgroups": [{ "name": "plugin-grp", "libs": [] }] }`,
      );
      await writeSettingsFile(
        `{
          "pli.pgm_conf": { "pgms": [{ "program": "b.pli", "pgroup": "settings-grp" }] },
          "pli.proc_grps": { "pgroups": [{ "name": "settings-grp", "libs": [] }] }
        }`,
      );
      workspace = new WorkspaceContext(
        vfs,
        makeConnection(settingsConfig({ pgmConf: true, procGrps: true })),
      );

      await workspace.config.init(UriUtils.toUri(WORKSPACE));

      expect(
        workspace.config.getProcessGroupConfig("plugin-grp"),
      ).toBeDefined();
      expect(
        workspace.config.getProcessGroupConfig("settings-grp"),
      ).toBeDefined();
      expect(
        workspace.config.hasProgramConfig(UriUtils.toUri("file:///ws/a.pli")),
      ).toBe(true);
      expect(
        workspace.config.hasProgramConfig(UriUtils.toUri("file:///ws/b.pli")),
      ).toBe(true);
    });

    test(".pliplugin/ wins on duplicate pgroup name", async () => {
      await vfs.writeFile(UriUtils.toUri("file:///ws/plugin-libs/x.inc"), "");
      await vfs.writeFile(UriUtils.toUri("file:///ws/settings-libs/x.inc"), "");
      await writePluginFiles(
        `{ "pgms": [] }`,
        `{ "pgroups": [{ "name": "default", "libs": ["plugin-libs"] }] }`,
      );
      await writeSettingsFile(
        `{
          "pli.proc_grps": { "pgroups": [{ "name": "default", "libs": ["settings-libs"] }] }
        }`,
      );
      workspace = new WorkspaceContext(
        vfs,
        makeConnection(settingsConfig({ procGrps: true })),
      );

      await workspace.config.init(UriUtils.toUri(WORKSPACE));

      const def = workspace.config.getProcessGroupConfig("default");
      const dirPaths = (def?.computedLibs ?? [])
        .filter(isLibsDir)
        .map((lib) => lib.path);
      expect(dirPaths).toContain("plugin-libs");
      expect(dirPaths).not.toContain("settings-libs");
    });

    test(".pliplugin/-only mode (no connection) still works", async () => {
      await writePluginFiles(
        `{ "pgms": [] }`,
        `{ "pgroups": [{ "name": "default", "libs": [] }] }`,
      );
      // workspace is created with no connection in beforeEach
      await workspace.config.init(UriUtils.toUri(WORKSPACE));
      expect(workspace.config.getProcessGroupConfig("default")).toBeDefined();
    });
  });
});
