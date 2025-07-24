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
import { URI } from "../../src/utils/uri";
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import { PluginConfigurationProviderInstance } from "../../src/workspace/plugin-configuration-provider";

describe("Compilation Unit Tests", () => {
  test("Create", () => {
    const uri = URI.parse("memory:///test/test.pli");
    const ch = new CompilationUnitHandler();

    const unit0 = ch.getCompilationUnit(uri);
    expect(unit0).toBeUndefined();

    const unit1 = ch.getOrCreateCompilationUnit(uri);
    expect(unit1).toBeDefined();

    const unit2 = ch.getCompilationUnit(uri);
    expect(unit2).toEqual(unit1);
  });

  test("Delete", () => {
    const uri = URI.parse("memory:///test/test.pli");
    const ch = new CompilationUnitHandler();

    const unit1 = ch.getOrCreateCompilationUnit(uri);
    expect(unit1).toBeDefined();

    const deleted1 = ch.deleteCompilationUnit(uri);
    expect(deleted1).toBe(true);

    const deleted2 = ch.deleteCompilationUnit(uri);
    expect(deleted2).toBe(false);

    const unit2 = ch.getCompilationUnit(uri);
    expect(unit2).toBeUndefined();
  });

  test("Create with config", () => {
    const uriEntry = URI.parse("file:///test/entry.pli");
    const uriLib = URI.parse("file:///test/lib.pli");
    const ch = new CompilationUnitHandler();

    // register configs
    expect(
      PluginConfigurationProviderInstance.hasRegisteredProgramConfigs(),
    ).toBe(false);
    PluginConfigurationProviderInstance.setProgramConfigs("", [
      {
        program: "test/entry.pli",
        pgroup: "",
      },
    ]);
    expect(
      PluginConfigurationProviderInstance.hasRegisteredProgramConfigs(),
    ).toBe(true);

    const config = PluginConfigurationProviderInstance.getProgramConfig(
      uriEntry,
    );
    expect(config).toBeDefined();

    // lib is not an entry point, but still valid for generating a compilation unit
    const unit1 = ch.getOrCreateCompilationUnit(uriLib);
    expect(unit1).toBeDefined();

    // entry point should also setup a compilation unit as expected
    const unit2 = ch.getOrCreateCompilationUnit(uriEntry);
    expect(unit2).toBeDefined();
  });

  test("Create with wildcard config", () => {
    const uriEntry1 = URI.parse("file:///test/entry1.pli");
    const uriEntry2 = URI.parse("file:///test/entry2.pli");
    const uriOther = URI.parse("file:///other/entry3.pli");
    const ch = new CompilationUnitHandler();

    // register wildcard config
    PluginConfigurationProviderInstance.setProgramConfigs("", [
      {
        program: "test/*.pli",
        pgroup: "",
      },
    ]);

    // entry 1 should match wildcard config
    const config1 = PluginConfigurationProviderInstance.getProgramConfig(
      uriEntry1,
    );
    expect(config1).toBeDefined();

    // entry 2 should also match
    const config2 = PluginConfigurationProviderInstance.getProgramConfig(
      uriEntry2,
    );
    expect(config2).toBeDefined();

    // entry 3 should not match
    const configOther = PluginConfigurationProviderInstance.getProgramConfig(
      uriOther,
    );
    expect(configOther).toBeUndefined();

    // compilation units should be created for matching uris
    const unit1 = ch.getOrCreateCompilationUnit(uriEntry1);
    expect(unit1).toBeDefined();
    const unit2 = ch.getOrCreateCompilationUnit(uriEntry2);
    expect(unit2).toBeDefined();
    // compilation unit for non-matching uri should still be created
    const unitOther = ch.getOrCreateCompilationUnit(uriOther);
    expect(unitOther).toBeDefined();
  });

  test("Cannot create compile unit from copybook directly", () => {
    const ch = new CompilationUnitHandler();

    PluginConfigurationProviderInstance.init("file:///");

    // Simulate a process group 'default' with a cpy folder and include-extensions
    PluginConfigurationProviderInstance.setProgramConfigs("file:///", [
      {
        program: "src/*.pli",
        pgroup: "default",
      },
    ]);
    // Simulate the process group config (normally this would be loaded from a config file)
    PluginConfigurationProviderInstance.setProcessGroupConfigs([
      {
        name: "default",
        "compiler-options": [],
        libs: ["cpy"],
        "include-extensions": [".inc"],
      },
    ]);

    // File in the cpy folder
    const libUri = URI.parse("file:///cpy/b.inc");
    // File in the src folder (should be valid)
    const mainUri = URI.parse("file:///src/a.pli");

    // Should not create a compilation unit for a file in the cpy folder
    const libUnit = ch.getOrCreateCompilationUnit(libUri);
    expect(libUnit).toBeUndefined();

    // Should create a compilation unit for a file in the src folder
    const mainUnit = ch.getOrCreateCompilationUnit(mainUri);
    expect(mainUnit).toBeDefined();
  });
});
