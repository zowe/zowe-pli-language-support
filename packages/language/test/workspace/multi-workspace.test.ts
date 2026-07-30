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
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import { TestGlobalConfigLoader, UriUtils, VirtualFileSystemProvider } from "../../src";
import { resetDocumentProviders } from "../../src/language-server/text-documents";
import { LongRunningOperationImpl } from "../../src/utils/promises";

describe("Multi Workspace Tests", () => {
  test("With plugin configs under disjoint folders", async () => {
    const fs = new VirtualFileSystemProvider();
    resetDocumentProviders(fs);
    const ch = new CompilationUnitHandler(fs, new TestGlobalConfigLoader({}), LongRunningOperationImpl.Dummy);

    const first = {
      workspaceFolder: UriUtils.toUri("file:///first"),
      programConfig: UriUtils.toUri("file:///first/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///first/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///first/test1.pli"),
    };
    const second = {
      workspaceFolder: UriUtils.toUri("file:///second"),
      programConfig: UriUtils.toUri("file:///second/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///second/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///second/test2.pli"),
    };

    await fs.writeFile(
      first.programConfig,
      JSON.stringify({
        pgms: [
          {
            program: "*.pli",
            pgroup: "xxx",
          },
        ],
      }),
    );
    await fs.writeFile(
      first.groupsConfig,
      JSON.stringify({
        pgroups: [
          {
            name: "xxx",
            "compiler-options": ["AGGREGATE"],
            "member-name-validation": true,
            libs: ["cpy"],
            "include-extensions": [".pli", ".cpy", ".inc"],
          },
        ],
      }),
    );
    await fs.writeFile(first.program, "/* test1 */");
    await fs.writeFile(
      second.programConfig,
      JSON.stringify({
        pgms: [
          {
            program: "*.pli",
            pgroup: "yyy",
          },
        ],
      }),
    );
    await fs.writeFile(
      second.groupsConfig,
      JSON.stringify({
        pgroups: [
          {
            name: "yyy",
            "compiler-options": ["MARGINS(20,100)"],
            "member-name-validation": true,
            libs: ["cpy"],
            "include-extensions": [".pli", ".cpy", ".inc"],
          },
        ],
      }),
    );
    await fs.writeFile(second.program, "/* test2 */");

    const firstWorkspace = await ch.initializeWorkspaceFolder(
      first.workspaceFolder,
    );
    const secondWorkspace = await ch.initializeWorkspaceFolder(
      second.workspaceFolder,
    );

    expect(firstWorkspace.config.hasProgramConfig(first.program)).toBeTruthy();
    const firstConfig = firstWorkspace.config.getProgramConfig(first.program)!;
    const firstGroup = firstWorkspace.config.getProcessGroupConfig(
      firstConfig.pgroup.value,
    )!;
    expect(
      firstGroup.compilerOptions.map((co) => co.value).includes("AGGREGATE"),
    ).toBeTruthy();

    expect(
      secondWorkspace.config.hasProgramConfig(second.program),
    ).toBeTruthy();
    const secondConfig = secondWorkspace.config.getProgramConfig(
      second.program,
    )!;
    const secondGroup = secondWorkspace.config.getProcessGroupConfig(
      secondConfig.pgroup.value,
    )!;
    expect(
      secondGroup.compilerOptions
        .map((co) => co.value)
        .includes("MARGINS(20,100)"),
    ).toBeTruthy();
  });

  test("With plugin configs under nested folders", async () => {
    const fs = new VirtualFileSystemProvider();
    resetDocumentProviders(fs);
    const ch = new CompilationUnitHandler(fs, new TestGlobalConfigLoader({}),LongRunningOperationImpl.Dummy);

    const first = {
      workspaceFolder: UriUtils.toUri("file:///first"),
      programConfig: UriUtils.toUri("file:///first/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///first/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///first/test1.pli"),
    };
    const second = {
      workspaceFolder: UriUtils.toUri("file:///first/second"),
      programConfig: UriUtils.toUri(
        "file:///first/second/.pliplugin/pgm_conf.json",
      ),
      groupsConfig: UriUtils.toUri(
        "file:///first/second/.pliplugin/proc_grps.json",
      ),
      program: UriUtils.toUri("file:///first/second/test2.pli"),
    };

    await fs.writeFile(
      first.programConfig,
      JSON.stringify({
        pgms: [
          {
            program: "*.pli",
            pgroup: "xxx",
          },
        ],
      }),
    );
    await fs.writeFile(
      first.groupsConfig,
      JSON.stringify({
        pgroups: [
          {
            name: "xxx",
            "compiler-options": ["AGGREGATE"],
            "member-name-validation": true,
            libs: ["cpy"],
            "include-extensions": [".pli", ".cpy", ".inc"],
          },
        ],
      }),
    );
    await fs.writeFile(first.program, "/* test1 */");
    await fs.writeFile(
      second.programConfig,
      JSON.stringify({
        pgms: [
          {
            program: "*.pli",
            pgroup: "yyy",
          },
        ],
      }),
    );
    await fs.writeFile(
      second.groupsConfig,
      JSON.stringify({
        pgroups: [
          {
            name: "yyy",
            "compiler-options": ["MARGINS(20,100)"],
            "member-name-validation": true,
            libs: ["cpy"],
            "include-extensions": [".pli", ".cpy", ".inc"],
          },
        ],
      }),
    );
    await fs.writeFile(second.program, "/* test2 */");

    const firstWorkspace = await ch.initializeWorkspaceFolder(
      first.workspaceFolder,
    );
    const secondWorkspace = await ch.initializeWorkspaceFolder(
      second.workspaceFolder,
    );

    expect(firstWorkspace.config.hasProgramConfig(first.program)).toBeTruthy();
    const firstConfig = firstWorkspace.config.getProgramConfig(first.program)!;
    const firstGroup = firstWorkspace.config.getProcessGroupConfig(
      firstConfig.pgroup.value,
    )!;
    expect(
      firstGroup.compilerOptions.map((co) => co.value).includes("AGGREGATE"),
    ).toBeTruthy();

    expect(
      secondWorkspace.config.hasProgramConfig(second.program),
    ).toBeTruthy();
    const secondConfig = secondWorkspace.config.getProgramConfig(
      second.program,
    )!;
    const secondGroup = secondWorkspace.config.getProcessGroupConfig(
      secondConfig.pgroup.value,
    )!;
    expect(
      secondGroup.compilerOptions
        .map((co) => co.value)
        .includes("MARGINS(20,100)"),
    ).toBeTruthy();
  });

  test("For files outside the specified folders", async () => {
    const fs = new VirtualFileSystemProvider();
    resetDocumentProviders(fs);
    const settingsUri = UriUtils.toUri("file:///settings.json");
    const ch = new CompilationUnitHandler(fs, new TestGlobalConfigLoader({
      pgmConf: {
        configKey: "pli.pgm_conf",
        uri: settingsUri.toString(),
        containerPath: [],
      },
      procGrps: {
        configKey: "pli.proc_grps",
        uri: settingsUri.toString(),
        containerPath: [],
      },
    }), LongRunningOperationImpl.Dummy);

    const first = {
      workspaceFolder: UriUtils.toUri("file:///first"),
      programConfig: UriUtils.toUri("file:///first/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///first/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///first/test1.pli"),
    };
    const outsideProgram = UriUtils.toUri("file:///outside/test2.pli");

    await fs.writeFile(
      settingsUri,
      JSON.stringify({
        "pli.pgm_conf": {
          pgms: [
            {
              program: "**/*.pli",
              pgroup: "xxx",
            },
          ],
        },
        "pli.proc_grps": {
          pgroups: [
            {
              name: "xxx",
              "compiler-options": ["AGGREGATE"],
              "member-name-validation": true,
              libs: ["cpy"],
              "include-extensions": [".pli", ".cpy", ".inc"],
            },
          ],
        },
      }, null, 2),
    );

    await fs.writeFile(
      first.programConfig,
      JSON.stringify({
        pgms: [
          {
            program: "*.pli",
            pgroup: "xxx",
          },
        ],
      }),
    );
    await fs.writeFile(
      first.groupsConfig,
      JSON.stringify({
        pgroups: [
          {
            name: "xxx",
            "compiler-options": ["AGGREGATE"],
            "member-name-validation": true,
            libs: ["cpy"],
            "include-extensions": [".pli", ".cpy", ".inc"],
          },
        ],
      }),
    );
    await fs.writeFile(first.program, "/* test1 */");
    await fs.writeFile(outsideProgram, "/* test2 */");

    await ch.initializeFallbackFolderForScheme("file");

    const firstWorkspace = await ch.initializeWorkspaceFolder(
      first.workspaceFolder,
    );

    expect(firstWorkspace.config.hasProgramConfig(first.program)).toBeTruthy();
    const firstConfig = firstWorkspace.config.getProgramConfig(first.program)!;
    const firstGroup = firstWorkspace.config.getProcessGroupConfig(
      firstConfig.pgroup.value,
    )!;
    expect(
      firstGroup.compilerOptions.map((co) => co.value).includes("AGGREGATE"),
    ).toBeTruthy();

    const workspaceOutside = ch.getWorkspaceFolderOf(outsideProgram);
    expect(workspaceOutside).toBeDefined();
    expect(workspaceOutside!.config.hasProgramConfig(outsideProgram)).toBeTruthy();
    expect(workspaceOutside!.config.getProgramConfig(outsideProgram)!.pgroup.value).toBe("xxx");
  });
});
