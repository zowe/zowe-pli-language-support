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
import { CancellationToken } from "vscode-languageserver";
import { UriUtils } from "../../src/utils/uri";
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import * as lifecycle from "../../src/workspace/lifecycle";
import { TextDocuments } from "../../src/language-server/text-documents";
import { makeProcessGroup, makeProgramConfig } from "../config-fixtures";
import { createTestWorkspace, defaultTestWorkspace } from "../test-workspace";
import {
  FileSystemProvider,
  TestGlobalConfigLoader,
  VirtualFileSystemProvider,
} from "../../src";
import { LongRunningOperationImpl } from "../../src/utils/promises";

describe("Compilation Unit Tests", () => {
  let fs: FileSystemProvider;

  beforeEach(() => {
    fs = new VirtualFileSystemProvider();
  });

  afterEach(async () => {
    defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), []);
    await defaultTestWorkspace().config.setProcessGroupConfigs([]);
  });

  test("Create", async () => {
    const uri = UriUtils.toUri("memory:///test/test.pli");
    const ch = new CompilationUnitHandler(
      fs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(
      UriUtils.toUri("memory:///test/"),
      defaultTestWorkspace(),
    );

    const unit0 = ch.getCompilationUnit(uri);
    expect(unit0).toBeUndefined();

    const unit1 = await ch.getOrCreateCompilationUnit(uri);
    expect(unit1).toBeDefined();

    const unit2 = ch.getCompilationUnit(uri);
    expect(unit2).toEqual(unit1);
  });

  test("Delete", async () => {
    const uri = UriUtils.toUri("memory:///test/test.pli");
    const ch = new CompilationUnitHandler(
      fs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(
      UriUtils.toUri("memory:///test/"),
      defaultTestWorkspace(),
    );

    const unit1 = await ch.getOrCreateCompilationUnit(uri);
    expect(unit1).toBeDefined();

    const deleted1 = ch.deleteCompilationUnit(uri);
    expect(deleted1).toBe(true);

    const deleted2 = ch.deleteCompilationUnit(uri);
    expect(deleted2).toBe(false);

    const unit2 = ch.getCompilationUnit(uri);
    expect(unit2).toBeUndefined();
  });

  test("Create with config", async () => {
    const uriEntry = UriUtils.toUri("file:///test/entry.pli");
    const uriLib = UriUtils.toUri("file:///test/lib.pli");
    const ch = new CompilationUnitHandler(
      fs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(
      UriUtils.toUri("file:///test/"),
      defaultTestWorkspace(),
    );

    // register configs
    expect(defaultTestWorkspace().config.hasRegisteredProgramConfigs()).toBe(
      false,
    );
    defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), [
      makeProgramConfig({ program: "test/entry.pli", pgroup: "" }),
    ]);
    expect(defaultTestWorkspace().config.hasRegisteredProgramConfigs()).toBe(
      true,
    );

    const config = defaultTestWorkspace().config.getProgramConfig(uriEntry);
    expect(config).toBeDefined();

    // lib is not an entry point, but still valid for generating a compilation unit
    const unit1 = await ch.getOrCreateCompilationUnit(uriLib);
    expect(unit1).toBeDefined();

    // entry point should also setup a compilation unit as expected
    const unit2 = await ch.getOrCreateCompilationUnit(uriEntry);
    expect(unit2).toBeDefined();
  });

  test("Create with wildcard config", async () => {
    const uriEntry1 = UriUtils.toUri("file:///test/entry1.pli");
    const uriEntry2 = UriUtils.toUri("file:///test/entry2.pli");
    const uriOther = UriUtils.toUri("file:///other/entry3.pli");
    const ch = new CompilationUnitHandler(
      fs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(UriUtils.toUri("file:///"), defaultTestWorkspace());

    // register wildcard config
    defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), [
      makeProgramConfig({ program: "test/*.pli", pgroup: "" }),
    ]);

    // entry 1 should match wildcard config
    const config1 = defaultTestWorkspace().config.getProgramConfig(uriEntry1);
    expect(config1).toBeDefined();

    // entry 2 should also match
    const config2 = defaultTestWorkspace().config.getProgramConfig(uriEntry2);
    expect(config2).toBeDefined();

    // entry 3 should not match
    const configOther =
      defaultTestWorkspace().config.getProgramConfig(uriOther);
    expect(configOther).toBeUndefined();

    // compilation units should be created for matching uris
    const unit1 = await ch.getOrCreateCompilationUnit(uriEntry1);
    expect(unit1).toBeDefined();
    const unit2 = await ch.getOrCreateCompilationUnit(uriEntry2);
    expect(unit2).toBeDefined();
    // compilation unit for non-matching uri should still be created
    const unitOther = await ch.getOrCreateCompilationUnit(uriOther);
    expect(unitOther).toBeDefined();
  });

  test("Cannot create compile unit from copybook directly", async () => {
    const ch = new CompilationUnitHandler(
      fs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(UriUtils.toUri("file:///"), defaultTestWorkspace());

    await defaultTestWorkspace().config.init(UriUtils.toUri("file:///"));

    // Simulate a process group 'default' with a cpy folder and include-extensions
    defaultTestWorkspace().config.setProgramConfigs(
      UriUtils.toUri("file:///"),
      [makeProgramConfig({ program: "src/*.pli", pgroup: "default" })],
    );
    // Simulate the process group config (normally this would be loaded from a config file)
    await defaultTestWorkspace().config.setProcessGroupConfigs([
      makeProcessGroup({
        name: "default",
        libs: ["cpy"],
        includeExtensions: [".inc"],
        checkMargins: false,
        instructionCounterLimit: 5000,
        caseUpperValidation: false,
      }),
    ]);

    // File in the cpy folder
    const libUri = UriUtils.toUri("file:///cpy/b.inc");
    // File in the src folder (should be valid)
    const mainUri = UriUtils.toUri("file:///src/a.pli");

    // Should not create a compilation unit for a file in the cpy folder
    const libUnit = await ch.getOrCreateCompilationUnit(libUri);
    expect(libUnit).toBeUndefined();

    // Should create a compilation unit for a file in the src folder
    const mainUnit = await ch.getOrCreateCompilationUnit(mainUri);
    expect(mainUnit).toBeDefined();
  });

  test("Creates and reads a compilation unit for an entry point inside a lib directory", async () => {
    const testFs = new VirtualFileSystemProvider();
    const workspace = createTestWorkspace(testFs);
    const wsUri = UriUtils.toUri("file:///");

    // The program entry lives in `src`, which is ALSO configured as a lib, and
    // pulls in a neighbouring include from that same directory.
    const entryUri = UriUtils.toUri("file:///src/a.pli");
    await testFs.writeFile(entryUri, " DCL B CHAR;\n %INCLUDE inc;\n");
    await testFs.writeFile(
      UriUtils.toUri("file:///src/inc.inc"),
      " DCL A CHAR;\n",
    );

    await workspace.config.init(wsUri);
    workspace.config.setProgramConfigs(wsUri, [
      makeProgramConfig({ program: "src/a.pli", pgroup: "default" }),
    ]);
    await workspace.config.setProcessGroupConfigs([
      makeProcessGroup({
        name: "default",
        libs: ["src"],
        includeExtensions: [".pli", ".inc"],
      }),
    ]);

    const ch = new CompilationUnitHandler(
      testFs,
      new TestGlobalConfigLoader({}),
      LongRunningOperationImpl.Dummy,
    );
    ch.addWorkspaceFolder(wsUri, workspace);

    // Entry point gets a unit even though `src` is also a lib directory — and
    // (the actual bug) its text is read and its include resolved through the lib.
    const entryUnit = await ch.getOrCreateCompilationUnit(entryUri);
    expect(entryUnit).toBeDefined();
    const doc = await TextDocuments.get(entryUri);
    await lifecycle.lifecycle(entryUnit!, doc!, CancellationToken.None);
    const tokens = entryUnit!.tokens.map((t) => t.image);
    expect(tokens).toContain("B");
    expect(tokens).toContain("A");

    // A non-entry file in the same lib directory stays a standalone lib file.
    const libUnit = await ch.getOrCreateCompilationUnit(
      UriUtils.toUri("file:///src/inc.inc"),
    );
    expect(libUnit).toBeUndefined();
  });

  describe("Process group inference from lib path", () => {
    async function setupWorkspace() {
      const testFs = new VirtualFileSystemProvider();
      // The lib directory must exist on disk, otherwise the lib expander
      // drops it from the process group's `computedLibs`.
      await testFs.writeFile(UriUtils.toUri("file:///cpy/inc.inc"), "");
      const workspace = createTestWorkspace(testFs);
      const wsUri = UriUtils.toUri("file:///");
      await workspace.config.init(wsUri);
      await workspace.config.setProcessGroupConfigs([
        makeProcessGroup({
          name: "default",
          libs: ["cpy"],
          includeExtensions: [".inc"],
        }),
        makeProcessGroup({
          name: "configured",
          libs: [],
          includeExtensions: [".inc"],
        }),
      ]);
      return { workspace, wsUri };
    }

    test("infers the process group from the lib directory without a program config", async () => {
      const { workspace } = await setupWorkspace();
      // `.cpy` is not a registered include extension, so the file gets its own
      // compilation unit despite living in a lib directory.
      const unit = await workspace.getOrCreateCompilationUnit(
        UriUtils.toUri("file:///cpy/b.cpy"),
      );
      expect(unit).toBeDefined();
      expect(unit!.programConfig).toBeUndefined();
      expect(unit!.processGroup?.name.value).toBe("default");
    });

    test("program config takes precedence over lib path inference", async () => {
      const { workspace, wsUri } = await setupWorkspace();
      workspace.config.setProgramConfigs(wsUri, [
        makeProgramConfig({ program: "cpy/a.pli", pgroup: "configured" }),
      ]);
      const unit = await workspace.getOrCreateCompilationUnit(
        UriUtils.toUri("file:///cpy/a.pli"),
      );
      expect(unit).toBeDefined();
      // The file lives in the "default" group's lib dir, but its program
      // config binds it to "configured".
      expect(unit!.processGroup?.name.value).toBe("configured");
    });

    test("has no process group for files outside of lib directories", async () => {
      const { workspace } = await setupWorkspace();
      const unit = await workspace.getOrCreateCompilationUnit(
        UriUtils.toUri("file:///src/plain.pli"),
      );
      expect(unit).toBeDefined();
      expect(unit!.processGroup).toBeUndefined();
    });

    test("resolves includes in a standalone lib file via the inferred process group", async () => {
      const testFs = new VirtualFileSystemProvider();
      const workspace = createTestWorkspace(testFs);
      const wsUri = UriUtils.toUri("file:///");

      const copybookUri = UriUtils.toUri("file:///cpy/main.cpy");
      await testFs.writeFile(copybookUri, " DCL B CHAR;\n %INCLUDE inc;\n");
      await testFs.writeFile(
        UriUtils.toUri("file:///cpy/inc.inc"),
        " DCL A CHAR;\n",
      );

      await workspace.config.init(wsUri);
      await workspace.config.setProcessGroupConfigs([
        makeProcessGroup({
          name: "default",
          libs: ["cpy"],
          includeExtensions: [".inc"],
        }),
      ]);

      // The copybook has no program config, but its location inside the lib
      // directory associates it with the "default" process group, which in
      // turn resolves its include.
      const unit = await workspace.getOrCreateCompilationUnit(copybookUri);
      expect(unit).toBeDefined();
      expect(unit!.processGroup?.name.value).toBe("default");

      const doc = await TextDocuments.get(copybookUri);
      await lifecycle.lifecycle(unit!, doc!, CancellationToken.None);
      const tokens = unit!.tokens.map((t) => t.image);
      expect(tokens).toContain("B");
      expect(tokens).toContain("A");
    });

    test("applies process group compiler options to a standalone lib file", async () => {
      const testFs = new VirtualFileSystemProvider();
      const copybookUri = UriUtils.toUri("file:///cpy/b.cpy");
      await testFs.writeFile(copybookUri, " DCL A CHAR;\n");
      const workspace = createTestWorkspace(testFs);
      const wsUri = UriUtils.toUri("file:///");
      await workspace.config.init(wsUri);

      // The copybook is not listed in the program config, but the "default"
      // process group is inferred from its lib directory, pulling in both a
      // program config of that group and the group's compiler options.
      workspace.config.setProgramConfigs(wsUri, [
        makeProgramConfig({ program: "src/main.pli", pgroup: "default" }),
      ]);
      await workspace.config.setProcessGroupConfigs([
        makeProcessGroup({
          name: "default",
          libs: ["cpy"],
          includeExtensions: [".inc"],
          compilerOptions: ["OR('|!')"],
        }),
      ]);

      const unit = await workspace.getOrCreateCompilationUnit(copybookUri);
      expect(unit).toBeDefined();
      expect(unit!.programConfig?.program.value).toBe("src/main.pli");

      const doc = await TextDocuments.get(copybookUri);
      await lifecycle.lifecycle(unit!, doc!, CancellationToken.None);
      expect(unit!.compilerOptions.or).toBe("|!");
    });
  });
});
