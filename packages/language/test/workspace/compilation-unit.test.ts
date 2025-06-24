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
      uriEntry.toString(),
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
      uriEntry1.toString(),
    );
    expect(config1).toBeDefined();

    // entry 2 should also match
    const config2 = PluginConfigurationProviderInstance.getProgramConfig(
      uriEntry2.toString(),
    );
    expect(config2).toBeDefined();
    
    // entry 3 should not match
    const configOther = PluginConfigurationProviderInstance.getProgramConfig(
      uriOther.toString(),
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
});
