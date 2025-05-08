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

    // lib is not an entry point
    const unit1 = ch.getOrCreateCompilationUnit(uriLib);
    expect(unit1).toBeUndefined();

    // entry point should setup a compilation unit
    const unit2 = ch.getOrCreateCompilationUnit(uriEntry);
    expect(unit2).toBeDefined();
  });
});
