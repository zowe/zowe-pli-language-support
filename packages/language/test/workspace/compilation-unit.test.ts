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
import { UriUtils } from "../../src/utils/uri";
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import { makeProcessGroup, makeProgramConfig } from "../config-fixtures";
import { defaultTestWorkspace } from "../test-workspace";
import { FileSystemProvider, VirtualFileSystemProvider } from "../../src";

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
    const ch = new CompilationUnitHandler(fs);
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
    const ch = new CompilationUnitHandler(fs);
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
    const ch = new CompilationUnitHandler(fs);
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
    const ch = new CompilationUnitHandler(fs);
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
    const ch = new CompilationUnitHandler(fs);
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
});
